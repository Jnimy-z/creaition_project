# Vue 3 + Vite
## Tech Stack Selection (Pure JS + Less Compatibility)
- Core Framework: Vue3 + Vite (Efficient building without TypeScript configuration)
- State Management: Pinia (Lightweight and dependency-free, natively supported by JS, managing AI states and user preferences)
- UI Adaptation: Native CSS + Less Variables (Flexibly mapping design systems and simplifying style organization)
- Image Editing Core: tui-image-editor@3.15.0 (Specified version, natively compatible with JS)
- AI API Interaction: Axios (Handling requests, error retries, and cross-domain issues)
- Style Tool: Less (Replacing Sass with simpler syntax and no additional complex configuration)
- Deployment Platform: Vercel/Netlify (Rapid deployment with support for static resources and API proxies)
### Environment Setup Steps
1. Create a Vue3 project
  `npm create vite@latest creaition-project -- --template vue`
  `cd creaition-project`
  `npm install`
  `Install core dependencies`
2. Image editor core
  `npm install tui-image-editor@3.15.0 fabric@4.2.0`
    Tool dependencies
   `npm install axios pinia`
   `npm install -D less less-loader`
3. Basic configuration
   Create src/style/variables.less to define Creaition design system variables (Less syntax)
   Configure vite.config.js to resolve cross-domain issues and path aliases
   Initialize Pinia and import global styles in src/main.js
   Create src/style/global.less (Global common styles)
## Design System Integration & Tui.ImageEditor Adaptation
1. Customize Tui.ImageEditor theme (Adapting to Creaition design system)
   Create src/components/ImageEditor/theme.js to define theme configuration
   Create src/components/ImageEditor/ImageEditor.vue (Main editor component) to initialize and inject the theme
2. Encapsulate custom toolbar and properties panel (Less style adaptation)
   Create src/components/ImageEditor/Toolbar.vue (Custom toolbar)
   Create src/components/ImageEditor/PropertiesPanel.vue (Properties panel)
3. Responsive design integration
   Integrate all components in src/views/EditorView.vue and handle responsive logic
## AI API Integration & State Management
1. Encapsulate AI API service (Handling requests, errors, and retries)
   Create src/services/aiImageService.js
   Create a .env file (root directory) to configure API Token
2. Pinia state management (Managing AI generation states, history, and favorites)
   Create src/stores/aiImageStore.js
3. Implement AI generation panel (Integrated into the editor)
   Create src/components/ImageEditor/AiPanel.vue
# Running Steps
1. Configure API Token: Open the .env file and replace your_huggingface_token_here with your Hugging Face Token (Obtained from https://huggingface.co/settings/tokens, need to check the api permission)
2. Install dependencies: Open the terminal, navigate to the project root directory, and execute npm install
3. Start the project: Execute npm run dev, and visit http://127.0.0.1:5173 after compilation is complete