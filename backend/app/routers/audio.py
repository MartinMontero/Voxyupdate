from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from ..database import get_db
from ..models import AudioGeneration, Project
from ..services.audio_generator import AudioGenerator
from ..schemas import AudioGenerationCreate, AudioGenerationResponse

router = APIRouter()
audio_generator = AudioGenerator()

@router.post("/generate", response_model=AudioGenerationResponse)
async def start_audio_generation(
    generation_data: AudioGenerationCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Start audio generation process"""
    try:
        # Verify project exists
        project = await db.get(Project, generation_data.project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Create generation record
        generation = AudioGeneration(
            project_id=generation_data.project_id,
            settings=generation_data.settings.dict(),
            status="queued"
        )
        
        db.add(generation)
        await db.commit()
        await db.refresh(generation)
        
        # Start background generation
        background_tasks.add_task(
            audio_generator.generate_podcast,
            str(generation.id)
        )
        
        return AudioGenerationResponse.from_orm(generation)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/generations/{generation_id}", response_model=AudioGenerationResponse)
async def get_generation_status(
    generation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get generation status"""
    try:
        generation = await db.get(AudioGeneration, uuid.UUID(generation_id))
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        return AudioGenerationResponse.from_orm(generation)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid generation ID")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/generations", response_model=List[AudioGenerationResponse])
async def list_generations(
    project_id: str = None,
    db: AsyncSession = Depends(get_db)
):
    """List audio generations"""
    try:
        query = select(AudioGeneration)
        if project_id:
            query = query.where(AudioGeneration.project_id == uuid.UUID(project_id))
        
        result = await db.execute(query.order_by(AudioGeneration.created_at.desc()))
        generations = result.scalars().all()
        
        return [AudioGenerationResponse.from_orm(gen) for gen in generations]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))