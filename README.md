# Care Notes Enhancement Application

A web application that transforms rough care worker notes into professional, standardized documentation using AI-powered speech-to-text and note enhancement.

## 🚀 Features

- **Audio Recording**: Record care notes using your microphone
- **Speech-to-Text**: Automatic transcription using OpenAI Whisper
- **Note Enhancement**: Transform rough notes into professional documentation using GPT-4o
- **Template Types**: Support for different visit types (Standard, Medication, Therapy)
- **Local Storage**: All data stays on your device for privacy
- **Professional Formatting**: Structured output with proper formatting and highlighting

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- OpenAI API key

### Installation

1. **Clone or download the project**
   ```bash
   cd care-worker-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure OpenAI API Key**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env.local` file in the project root
   - Add your API key:
     ```
     VITE_OPENAI_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Navigate to `http://localhost:5173` in your browser

## 📱 How to Use

### Basic Workflow

1. **Select Visit Type**: Choose from Standard Care, Medication, or Therapy
2. **Record or Type Notes**: 
   - Click "Start Recording" to record audio notes
   - Or type directly in the text area
   - You can edit the transcribed text before enhancement
3. **Enhance Notes**: Click "🚀 Enhance Notes" to transform into professional format
4. **Save**: Click "Save Note" to store in local browser storage

### Features Overview

#### Audio Recording
- Click "Start Recording" to begin audio capture
- Click "Stop Recording" to end and automatically transcribe
- Requires microphone permissions

#### Text Editing
- Edit raw transcript in the left panel
- Character and word count displayed
- Supports manual typing and editing

#### Professional Enhancement
- AI transforms rough notes into structured format
- Includes sections for:
  - Patient Status (Physical & Mental/Emotional)
  - Care Provided (Activities & Patient Response)
  - Personal Connection Highlights
  - Areas of Concern
  - Care Plan Adherence
  - Next Visit Preparations

#### Data Management
- Notes saved to browser's local storage
- Data persists between sessions
- Export/import functionality available
- Privacy-focused: data never leaves your device

## 🏗️ Technical Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Storage**: Browser LocalStorage
- **AI Services**: OpenAI Whisper (transcription) + GPT-4o (enhancement)
- **Audio**: Web Audio API
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/          # React components
│   ├── AudioRecorder.tsx
│   ├── TextEditor.tsx
│   ├── EnhancementPanel.tsx
│   ├── TemplateSelector.tsx
│   └── ApiKeyWarning.tsx
├── services/           # API services
│   └── openai.ts
├── types/             # TypeScript interfaces
│   └── index.ts
├── utils/             # Utility functions
│   └── storage.ts
└── App.tsx            # Main application component
```

## 🔒 Privacy & Security

- **Local Data Storage**: All notes stored in browser's local storage
- **No Backend**: Direct API calls to OpenAI (API key required)
- **Data Privacy**: Notes never sent to external servers except OpenAI for processing
- **API Key Security**: Stored in environment variables

## 🚨 Important Notes

### API Key Security
- Never commit your `.env.local` file to version control
- The current setup uses `dangerouslyAllowBrowser: true` for OpenAI client
- For production use, implement a backend proxy for API calls

### Browser Compatibility
- Requires modern browser with Web Audio API support
- Microphone permissions required for audio recording
- LocalStorage support required for data persistence

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 📋 Future Enhancements

- [ ] Notes history and search functionality
- [ ] Export to PDF/Word formats
- [ ] User authentication and profiles
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Offline mode with sync
- [ ] Custom templates and prompts
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and professional use. Please ensure compliance with healthcare data regulations in your jurisdiction.

---

**Built with ❤️ for care workers who make a difference every day.**
