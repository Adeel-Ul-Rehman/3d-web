# 🌐 MobileFirst3D — AI-Powered Mobile-First 3D Website Generator

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-Inference_API-FFD21E?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co/)

**MobileFirst3D** is an autonomous full-stack platform that creates stunning, responsive, mobile-first 3D websites in seconds. Powered by an iterative multi-agent AI pipeline and WebGL/Three.js, it translates simple natural language ideas into production-ready 3D interactive web experiences.

---

## ✨ Features

- 📱 **Mobile-First 3D Architecture**: Every experience is optimized for touch gestures, mobile responsiveness, and high FPS rendering on both smartphones and desktop displays.
- 🤖 **Multi-Stage AI Pipeline**:
  - **Prompt Enhancer**: Expands brief inputs into comprehensive design, layout, and visual direction prompts.
  - **Dynamic Q&A Refinement**: Asks targeted questions to match your exact branding, style, and content goals.
  - **Code Generator**: Generates clean, self-contained HTML5, CSS, and Three.js 3D scenes.
  - **Quality Evaluation Loop**: Automated evaluation scoring with self-correcting refinement loops until the quality threshold is met.
- 🎨 **Rich 3D Template Gallery**:
  - **Architecture & Interior Design**: Interactive architectural visualizations and spatial lighting.
  - **3D Portfolio & Agency**: Sleek creative agency landing pages with floating 3D geometry.
  - **Interactive 3D Product Showcase**: 360° product inspection with materials, lighting, and orbit controls.
  - **SaaS & Modern Tech**: High-tech glow effects, particles, and futuristic UI.
  - **Virtual Showroom & Concept Store**: Immersive digital shopping experience.
  - **Futuristic VR / Metaverse Experience**: Cyberpunk grid aesthetics, neon shaders, and space themes.
- 🖼️ **Asset Management**: Upload your custom logos, images, and models to be woven directly into the generated site.
- ⚡ **Live Interactive Preview**: Sandboxed real-time iframe viewer with device frame switchers (Mobile, Tablet, Desktop) and instant hot reload.
- 📦 **One-Click Export**: Export production-ready standalone ZIP packages containing HTML, CSS, JavaScript, and assets — ready to deploy on Vercel, Netlify, or GitHub Pages.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **AI Engine**: Hugging Face Inference API (`@huggingface/inference`) with fallback procedural generation
- **Packaging & Storage**: [Archiver](https://www.npmjs.com/package/archiver), [fs-extra](https://www.npmjs.com/package/fs-extra), [Multer](https://www.npmjs.com/package/multer)
- **Development**: [Nodemon](https://nodemon.io/), [Concurrently](https://www.npmjs.com/package/concurrently)

---

## 📁 Project Structure

```text
3d-web/
├── backend/                      # Express backend & AI generation pipeline
│   ├── controllers/              # API route controllers
│   │   ├── generationController.js
│   │   ├── previewController.js
│   │   ├── downloadController.js
│   │   └── projectsController.js
│   ├── middleware/               # CORS, rate-limiting, error handling
│   ├── models/                   # Project models & schemas
│   ├── routes/                   # API endpoint declarations
│   ├── services/
│   │   └── aiPipeline/           # Prompt enhancer, code generator & loop controller
│   ├── generated/                # Directory for generated sites (.gitkeep)
│   ├── uploads/                  # User-uploaded assets (.gitkeep)
│   ├── .env                      # Backend environment variables
│   └── server.js                 # Backend server entry point
│
├── frontend/                     # React + Vite frontend application
│   ├── public/                   # Static assets, templates & previews
│   │   ├── templates/            # Template preview cards & thumbnails
│   │   └── previews/             # Standalone Three.js template demos
│   ├── src/
│   │   ├── components/           # UI components & screens
│   │   │   ├── screens/          # Landing, Dashboard, Gallery, Q&A, Preview
│   │   │   └── ui/               # Reusable buttons, cards, modals
│   │   ├── store/                # Zustand global state store
│   │   ├── hooks/                # Custom React hooks
│   │   └── App.jsx               # Application root
│   └── vite.config.js            # Vite configuration
│
├── package.json                  # Root npm workspace configuration
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Adeel-Ul-Rehman/3d-web.git
cd 3d-web
```

### 2. Install Dependencies

Install all root, backend, and frontend dependencies at once using npm workspaces:

```bash
npm install
```

### 3. Environment Variables

Create or configure a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
GENERATED_FILES_PATH=./generated
UPLOADS_PATH=./uploads
```

> **Note**: Even without a Hugging Face API key, the system contains an intelligent fallback engine that crafts complete, responsive Three.js 3D web templates automatically.

---

## 💻 Running the Application

### Option A: Run Both Frontend & Backend (Recommended)

From the root `3d-web` directory, run:

```bash
npm run dev
```

This starts both:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

### Option B: Run Services Individually

If you prefer separate terminal windows:

#### 1. Start the Backend
```bash
cd backend
npm run dev
```

#### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system status |
| `POST` | `/api/generate/questions` | Generate contextual clarification questions |
| `POST` | `/api/generate/start` | Launch the AI generation pipeline |
| `GET` | `/api/generate/status/:projectId` | Check generation progress & logs |
| `GET` | `/api/preview/:projectId` | Render the generated website inside sandbox |
| `GET` | `/api/download/:projectId` | Download generated project as a `.zip` archive |
| `GET` | `/api/projects` | List all created projects |

---

## 🔧 Windows PowerShell Tip

If you encounter the error:
`File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`

Run this once in PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Or prefix your commands with `npm.cmd` (e.g., `npm.cmd run dev`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
