# Care Worker Notes App

A professional note-taking application designed for care workers to record, enhance, and manage patient visit notes using AI assistance.

## Features

- 🎙️ Voice-to-text recording for easy note taking
- 🤖 AI-powered note enhancement using OpenAI
- 📝 Support for different visit types (standard, medication, therapy)
- 📊 Structured note format with patient status, care provided, and observations
- 📱 Modern, responsive UI built with React and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd care-worker-notes-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenAI API

## License

MIT
