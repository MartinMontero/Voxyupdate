from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
from typing import List, Optional
import asyncio
from contextlib import asynccontextmanager

from .database import engine, Base
from .routers import auth, projects, documents, audio, personas
from .services.document_processor import DocumentProcessor
from .services.audio_generator import AudioGenerator
from .config import settings

# Create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Voxy API",
    description="AI-powered podcast generation from documents",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])
app.include_router(personas.router, prefix="/api/personas", tags=["personas"])

@app.get("/")
async def root():
    return {"message": "Voxy API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )