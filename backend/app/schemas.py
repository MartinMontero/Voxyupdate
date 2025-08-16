from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User schemas
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    original_filename: str
    file_type: str
    file_size: int

class DocumentResponse(DocumentBase):
    id: uuid.UUID
    project_id: uuid.UUID
    filename: str
    status: str
    upload_progress: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Persona schemas
class PersonaBase(BaseModel):
    name: str
    role: str
    voice_id: str
    personality: str
    speaking_style: str
    avatar: str

class PersonaCreate(PersonaBase):
    is_custom: bool = True

class PersonaResponse(PersonaBase):
    id: uuid.UUID
    is_custom: bool
    user_id: Optional[uuid.UUID]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Generation schemas
class GenerationSettings(BaseModel):
    duration: str = Field(..., regex="^(5-10|10-15|15-20)$")
    personas: List[Dict[str, Any]]
    tone: str = Field(..., regex="^(educational|entertaining|balanced|debate)$")
    focus_areas: List[str] = []
    include_intro: bool = True
    include_outro: bool = True
    background_music: bool = False
    citation_style: str = Field(..., regex="^(inline|endnotes|timestamps)$")

class AudioGenerationCreate(BaseModel):
    project_id: uuid.UUID
    settings: GenerationSettings

class AudioGenerationResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    status: str
    progress: float
    current_step: str
    settings: Dict[str, Any]
    audio_url: Optional[str]
    transcript_url: Optional[str]
    duration: Optional[int]
    estimated_time: Optional[int]
    error_message: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Citation schemas
class CitationResponse(BaseModel):
    id: uuid.UUID
    generation_id: uuid.UUID
    document_id: uuid.UUID
    timestamp: float
    text: str
    source_text: str
    page_number: Optional[int]
    
    class Config:
        from_attributes = True