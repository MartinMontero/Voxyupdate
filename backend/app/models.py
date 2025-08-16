from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .database import Base
from pgvector.sqlalchemy import Vector

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="projects")
    documents = relationship("Document", back_populates="project")
    generations = relationship("AudioGeneration", back_populates="project")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    content = Column(Text)
    status = Column(String, default="uploading")  # uploading, processing, ready, error
    upload_progress = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    project = relationship("Project", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    embedding = Column(Vector(384))
    metadata = Column(JSON)
    
    document = relationship("Document", back_populates="chunks")

class Persona(Base):
    __tablename__ = "personas"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    voice_id = Column(String, nullable=False)
    personality = Column(Text, nullable=False)
    speaking_style = Column(Text, nullable=False)
    avatar = Column(String, nullable=False)
    is_custom = Column(Boolean, default=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AudioGeneration(Base):
    __tablename__ = "audio_generations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    status = Column(String, default="queued")  # queued, processing, completed, failed
    progress = Column(Float, default=0.0)
    current_step = Column(String, default="Initializing...")
    settings = Column(JSON, nullable=False)
    audio_url = Column(String)
    transcript_url = Column(String)
    duration = Column(Integer)  # in seconds
    estimated_time = Column(Integer)  # in seconds
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    project = relationship("Project", back_populates="generations")
    citations = relationship("Citation", back_populates="generation")

class Citation(Base):
    __tablename__ = "citations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    generation_id = Column(UUID(as_uuid=True), ForeignKey("audio_generations.id"))
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    timestamp = Column(Float, nullable=False)  # in seconds
    text = Column(Text, nullable=False)
    source_text = Column(Text, nullable=False)
    page_number = Column(Integer)
    
    generation = relationship("AudioGeneration", back_populates="citations")
    document = relationship("Document")
