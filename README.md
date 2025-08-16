# Voxy - AI-Powered Podcast Generator

Transform your documents into engaging podcast discussions with AI hosts. Built with ethical AI principles and fully open source.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- API keys for Anthropic Claude and ElevenLabs (optional)

### One-Click Deployment
```bash
git clone <repository-url>
cd voxy
./deploy.sh
```

The deployment script will:
1. Check system requirements
2. Create configuration files
3. Build and start all services
4. Verify everything is working

### Manual Setup

1. **Clone and Setup**
```bash
git clone <repository-url>
cd voxy
cp .env.example .env
```

2. **Configure API Keys**
Edit `.env` file with your API keys:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
```

3. **Start Services**
```bash
docker-compose up --build -d
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Framer Motion
- **File Upload**: react-dropzone
- **Audio Player**: wavesurfer.js

### Backend (Python + FastAPI)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with pgvector
- **Vector DB**: Qdrant for embeddings
- **Cache/Queue**: Redis
- **AI Services**: Anthropic Claude + ElevenLabs
- **Background Jobs**: Celery

### AI Pipeline
1. **Document Processing**: Extract text from PDF/DOCX/MD/TXT
2. **Embedding Generation**: Sentence-transformers for semantic search
3. **Conversation Generation**: Claude API for natural dialogue
4. **Audio Synthesis**: ElevenLabs TTS with persona voices
5. **Citation Tracking**: Source attribution throughout

## 📋 Features

### Core Functionality
- ✅ Multi-format document upload (PDF, DOCX, TXT, MD)
- ✅ AI persona selection and customization
- ✅ Conversation tone and length control
- ✅ Real-time generation progress
- ✅ High-quality audio output
- ✅ Citation tracking and export
- ✅ Project management

### AI Capabilities
- **Document Analysis**: Extract key concepts and themes
- **Conversation Generation**: Natural dialogue between personas
- **Voice Synthesis**: Multiple AI voices with personality
- **Citation Integration**: Automatic source attribution
- **Content Summarization**: Intelligent content synthesis

### User Experience
- **Drag & Drop Upload**: Intuitive file management
- **Real-time Progress**: Live generation updates
- **Audio Player**: Professional playback with controls
- **Export Options**: MP3/WAV with transcripts
- **Responsive Design**: Works on all devices

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database Setup
```bash
# Run migrations
alembic upgrade head

# Seed default personas
python -m app.scripts.seed_personas
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Load Testing
```bash
# Test 100 concurrent users
cd backend
locust -f tests/load_test.py --host=http://localhost:8000
```

## 📊 Performance

### Benchmarks
- **Document Processing**: ~2-5 seconds per document
- **Audio Generation**: ~2-3 minutes for 10-minute podcast
- **Concurrent Users**: Tested up to 100 simultaneous generations
- **Cost**: ~$0.30-0.50 per generated podcast

### Optimization
- Document chunking with overlap for better context
- Embedding caching to reduce API calls
- Audio segment caching for repeated content
- Background job processing for scalability

## 🔒 Security

### Data Protection
- All uploads stored locally by default
- Optional S3 integration for cloud storage
- No data sent to AI services without consent
- Automatic cleanup of temporary files

### API Security
- JWT authentication for user sessions
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration for frontend access

## 🌍 Deployment

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export ENVIRONMENT=production

# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
See `.env.example` for all configuration options.

### Scaling
- Horizontal scaling with multiple worker instances
- Database read replicas for high load
- CDN integration for audio file delivery
- Load balancer configuration included

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- TypeScript for frontend
- Python type hints for backend
- Comprehensive error handling
- Unit tests for all features
- Documentation for public APIs

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Documentation
- API Documentation: http://localhost:8000/docs
- Component Storybook: http://localhost:6006
- Architecture Guide: docs/ARCHITECTURE.md

### Community
- GitHub Issues: Bug reports and feature requests
- Discussions: General questions and ideas
- Bluesky: @voxy.ai
- Nostr: npub...

### Commercial Support
For enterprise deployments and custom features, contact us at support@voxy.ai

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core document-to-podcast functionality
- ✅ Multi-persona conversations
- ✅ Citation tracking
- ✅ Web interface

### Phase 2 (Next)
- [ ] Real-time collaboration
- [ ] Advanced persona customization
- [ ] Multi-language support
- [ ] Mobile app

### Phase 3 (Future)
- [ ] Video generation
- [ ] Live streaming integration
- [ ] Enterprise features
- [ ] Plugin ecosystem

---

Built with ❤️ for the open source community. Transform your documents into engaging audio experiences with Voxy!