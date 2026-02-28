const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.anim-fade-up').forEach(el => el.classList.add('anim-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim-fade-up').forEach(el => observer.observe(el));
}

async function loadQuotes() {
  try {
    const res = await fetch('./data/quotes.json');
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    return null;
  }
}

const app = createApp({
  setup() {
    const quotes = ref([]);
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const currentQuote = ref(null);
    const isAnimating = ref(false);
    const isScrolled = ref(false);
    const isDark = ref(false);
    const lang = ref('zh');

    const chapters = computed(() => {
      const seen = new Set();
      return quotes.value
        .map(q => ({ zh: q.chapter, en: q.chapter_en }))
        .filter(ch => {
          if (seen.has(ch.zh)) return false;
          seen.add(ch.zh);
          return true;
        });
    });

    const filteredQuotes = computed(() => {
      let result = quotes.value;

      if (activeFilter.value !== 'all') {
        result = result.filter(q => q.chapter === activeFilter.value);
      }

      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(q =>
          q.zh.toLowerCase().includes(query) ||
          q.en.toLowerCase().includes(query) ||
          q.chapter.toLowerCase().includes(query) ||
          q.chapter_en.toLowerCase().includes(query)
        );
      }

      return result;
    });

    function getDailyQuote() {
      if (!quotes.value.length) return null;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      let seed = 0;
      for (let i = 0; i < dateStr.length; i++) {
        seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
        seed |= 0;
      }

      const shownKey = 'mao_quotes_shown';
      let shown = [];
      try {
        shown = JSON.parse(localStorage.getItem(shownKey) || '[]');
      } catch { shown = []; }

      if (shown.length >= quotes.value.length) {
        shown = [];
      }

      const available = quotes.value.filter(q => !shown.includes(q.id));
      if (!available.length) return quotes.value[0];

      const index = Math.abs(seed) % available.length;
      const selected = available[index];

      if (!shown.includes(selected.id)) {
        shown.push(selected.id);
        localStorage.setItem(shownKey, JSON.stringify(shown));
      }

      return selected;
    }

    function nextQuote() {
      if (isAnimating.value || !quotes.value.length) return;
      isAnimating.value = true;

      const available = quotes.value.filter(q => q.id !== currentQuote.value?.id);
      const randomIndex = Math.floor(Math.random() * available.length);
      currentQuote.value = available[randomIndex] || quotes.value[0];

      setTimeout(() => { isAnimating.value = false; }, 400);
    }

    function scrollToQuotes() {
      const el = document.getElementById('quotes-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function setFilter(chapter) {
      activeFilter.value = chapter;
    }

    function toggleDark() {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle('dark', isDark.value);
      localStorage.setItem('mao_dark', isDark.value ? '1' : '0');
    }

    function toggleLang() {
      lang.value = lang.value === 'zh' ? 'en' : 'zh';
      localStorage.setItem('mao_lang', lang.value);
    }

    onMounted(async () => {
      const savedDark = localStorage.getItem('mao_dark');
      if (savedDark === '1' || (!savedDark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
      }

      const savedLang = localStorage.getItem('mao_lang');
      if (savedLang) lang.value = savedLang;

      const data = await loadQuotes();
      if (data) {
        quotes.value = data;
      } else {
        quotes.value = window.__QUOTES_FALLBACK__ || [];
      }
      currentQuote.value = getDailyQuote();

      window.addEventListener('scroll', () => {
        isScrolled.value = window.scrollY > 10;
      }, { passive: true });

      nextTick(() => {
        initScrollAnimations();
      });

      watch(filteredQuotes, () => {
        nextTick(() => {
          document.querySelectorAll('.quote-card.anim-fade-up:not(.anim-visible)').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('anim-visible');
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });
            observer.observe(el);
          });
        });
      });
    });

    return {
      quotes,
      searchQuery,
      activeFilter,
      currentQuote,
      isAnimating,
      isScrolled,
      isDark,
      lang,
      chapters,
      filteredQuotes,
      nextQuote,
      scrollToQuotes,
      setFilter,
      toggleDark,
      toggleLang,
    };
  }
});

app.mount('#app');
