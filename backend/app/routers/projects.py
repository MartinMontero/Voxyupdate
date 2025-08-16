from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from ..database import get_db
from ..models import Project, User
from ..schemas import ProjectCreate, ProjectResponse
from ..auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    try:
        db_project = Project(
            name=project.name,
            description=project.description,
            owner_id=current_user.id
        )
        
        db.add(db_project)
        await db.commit()
        await db.refresh(db_project)
        
        return ProjectResponse.from_orm(db_project)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List user's projects"""
    try:
        result = await db.execute(
            select(Project)
            .where(Project.owner_id == current_user.id)
            .order_by(Project.updated_at.desc())
        )
        projects = result.scalars().all()
        
        return [ProjectResponse.from_orm(project) for project in projects]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific project"""
    try:
        project = await db.get(Project, uuid.UUID(project_id))
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return ProjectResponse.from_orm(project)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a project"""
    try:
        project = await db.get(Project, uuid.UUID(project_id))
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        project.name = project_update.name
        project.description = project_update.description
        
        await db.commit()
        await db.refresh(project)
        
        return ProjectResponse.from_orm(project)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project"""
    try:
        project = await db.get(Project, uuid.UUID(project_id))
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        await db.delete(project)
        await db.commit()
        
        return {"message": "Project deleted successfully"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))