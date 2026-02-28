# 毛主席语录 · Quotations from Chairman Mao

1966版《毛主席语录》中英双语在线珍藏版。

A bilingual (Chinese-English) digital collection of *Quotations from Chairman Mao Tse-tung* (1966 edition).

## 在线预览 / Live Demo

GitHub Pages: [https://your-username.github.io/maozhuxiyulu/](https://your-username.github.io/maozhuxiyulu/)

## 功能特性 / Features

- **每日语录 / Daily Quote** — 每天随机推荐一条不重复的经典语录，中英双语展示
- **ASCII 肖像 / ASCII Portrait** — 使用 Canvas API 将主席头像 SVG 转换为红色 ASCII art
- **全文搜索 / Full-text Search** — 支持中英文关键词搜索
- **章节筛选 / Chapter Filter** — 按 33 个章节分类浏览
- **响应式设计 / Responsive** — 适配桌面端、平板和手机
- **纯静态部署 / Static Deployment** — 无需后端，可直接部署到 GitHub Pages

## 技术栈 / Tech Stack

| 技术 | 说明 |
|------|------|
| Vue 3 (CDN) | 前端框架，通过 CDN 引入 |
| Tailwind 风格 CSS | 手写 Shadcn 风格组件样式 |
| Canvas API | 图片转 ASCII art 渲染 |
| Google Fonts | Noto Serif SC + Noto Sans SC + Inter |

## 项目结构 / Project Structure

```
maozhuxiyulu/
├── docs/                  # GitHub Pages 部署目录
│   ├── index.html         # 主页面
│   ├── css/style.css      # 样式文件
│   ├── js/app.js          # Vue 应用逻辑
│   ├── data/quotes.json   # 40 条精选语录数据
│   └── img/               # 图片资源
│       └── mao-portrait.svg
├── design/                # 设计文档
│   └── 2026-02-28-design.md
├── raw-materials/         # 原始素材
└── README.md
```

## 本地运行 / Local Development

```bash
cd docs
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## 部署到 GitHub Pages / Deploy

1. 将代码推送到 GitHub 仓库
2. 进入 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，目录选择 `/docs`
5. 保存后等待部署完成

## 数据来源 / Data Source

语录内容来源于 1966 年出版的《毛主席语录》，英文翻译参考官方英译本 *Quotations from Chairman Mao Tse-tung*。

The quotes are sourced from the 1966 edition of *Quotations from Chairman Mao Tse-tung*, with English translations based on the official Foreign Languages Press edition.

## 许可证 / License

本项目仅用于学习和研究目的。语录内容属于公共领域。

This project is for educational and research purposes only. The quotation content is in the public domain.
