from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from ..database import get_db
from ..models import Persona, User
from ..schemas import PersonaCreate, PersonaResponse
from ..auth import get_current_user

router = APIRouter()

# Default personas data
DEFAULT_PERSONAS = [
    {
        "name": "Dr. Sarah Chen",
        "role": "Subject Matter Expert",
        "voice_id": "voice_1",
        "personality": "Thoughtful, precise, occasionally excited by complex ideas",
        "speaking_style": "Academic but accessible, defines jargon clearly",
        "avatar": "👩‍🏫"
    },
    {
        "name": "Marcus Rivera",
        "role": "Investigative Journalist",
        "voice_id": "voice_2",
        "personality": "Curious, skeptical, asks probing questions",
        "speaking_style": "Clear, direct, challenges assumptions",
        "avatar": "📰"
    },
    {
        "name": "Alex Kim",
        "role": "Curious Student",
        "voice_id": "voice_3",
        "personality": "Enthusiastic, asks clarifying questions, relates to everyday life",
        "speaking_style": "Conversational, uses analogies, seeks practical applications",
        "avatar": "🎓"
    },
    {
        "name": "Dr. James Wright",
        "role": "Critical Analyst",
        "voice_id": "voice_4",
        "personality": "Analytical, methodical, focuses on evidence and logic",
        "speaking_style": "Structured, references data, identifies patterns",
        "avatar": "📊"
    },
    {
        "name": "Maya Patel",
        "role": "Creative Storyteller",
        "voice_id": "voice_5",
        "personality": "Imaginative, finds narrative threads, makes content engaging",
        "speaking_style": "Vivid descriptions, uses metaphors, creates compelling narratives",
        "avatar": "📚"
    }
]

@router.get("/", response_model=List[PersonaResponse])
async def list_personas(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all available personas (default + user custom)"""
    try:
        # Get default personas
        result = await db.execute(
            select(Persona).where(Persona.is_custom == False)
        )
        default_personas = result.scalars().all()
        
        # Get user's custom personas
        result = await db.execute(
            select(Persona).where(
                Persona.is_custom == True,
                Persona.user_id == current_user.id
            )
        )
        custom_personas = result.scalars().all()
        
        all_personas = list(default_personas) + list(custom_personas)
        return [PersonaResponse.from_orm(persona) for persona in all_personas]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=PersonaResponse)
async def create_persona(
    persona: PersonaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a custom persona"""
    try:
        db_persona = Persona(
            name=persona.name,
            role=persona.role,
            voice_id=persona.voice_id,
            personality=persona.personality,
            speaking_style=persona.speaking_style,
            avatar=persona.avatar,
            is_custom=True,
            user_id=current_user.id
        )
        
        db.add(db_persona)
        await db.commit()
        await db.refresh(db_persona)
        
        return PersonaResponse.from_orm(db_persona)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{persona_id}", response_model=PersonaResponse)
async def get_persona(
    persona_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific persona"""
    try:
        persona = await db.get(Persona, uuid.UUID(persona_id))
        if not persona:
            raise HTTPException(status_code=404, detail="Persona not found")
        
        # Check access for custom personas
        if persona.is_custom and persona.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return PersonaResponse.from_orm(persona)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid persona ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{persona_id}")
async def delete_persona(
    persona_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a custom persona"""
    try:
        persona = await db.get(Persona, uuid.UUID(persona_id))
        if not persona:
            raise HTTPException(status_code=404, detail="Persona not found")
        
        # Only allow deletion of custom personas by their owner
        if not persona.is_custom or persona.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Cannot delete this persona")
        
        await db.delete(persona)
        await db.commit()
        
        return {"message": "Persona deleted successfully"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid persona ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed-defaults")
async def seed_default_personas(db: AsyncSession = Depends(get_db)):
    """Seed default personas (admin only)"""
    try:
        # Check if default personas already exist
        result = await db.execute(
            select(Persona).where(Persona.is_custom == False)
        )
        existing = result.scalars().all()
        
        if existing:
            return {"message": "Default personas already exist"}
        
        # Create default personas
        for persona_data in DEFAULT_PERSONAS:
            persona = Persona(
                **persona_data,
                is_custom=False,
                user_id=None
            )
            db.add(persona)
        
        await db.commit()
        return {"message": f"Created {len(DEFAULT_PERSONAS)} default personas"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))