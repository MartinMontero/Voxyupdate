from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import os
import aiofiles

from ..database import get_db
from ..models import Document, Project, User
from ..schemas import DocumentResponse
from ..auth import get_current_user
from ..services.document_processor import DocumentProcessor
from ..config import settings

router = APIRouter()
document_processor = DocumentProcessor()

@router.post("/upload/{project_id}", response_model=DocumentResponse)
async def upload_document(
    project_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a document to a project"""
    try:
        # Verify project exists and user has access
        project = await db.get(Project, uuid.UUID(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Validate file
        if file.size > settings.max_file_size:
            raise HTTPException(status_code=413, detail="File too large")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(settings.upload_dir, unique_filename)
        
        # Ensure upload directory exists
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Create document record
        document = Document(
            project_id=uuid.UUID(project_id),
            filename=unique_filename,
            original_filename=file.filename,
            file_type=file.content_type,
            file_size=file.size,
            status="uploading"
        )
        
        db.add(document)
        await db.commit()
        await db.refresh(document)
        
        # Start background processing
        background_tasks.add_task(
            document_processor.process_document,
            str(document.id)
        )
        
        return DocumentResponse.from_orm(document)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get document details"""
    try:
        document = await db.get(Document, uuid.UUID(document_id))
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Check access through project
        project = await db.get(Project, document.project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return DocumentResponse.from_orm(document)
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document"""
    try:
        document = await db.get(Document, uuid.UUID(document_id))
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Check access through project
        project = await db.get(Project, document.project_id)
        if not project or project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Delete file from filesystem
        file_path = os.path.join(settings.upload_dir, document.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete from database
        await db.delete(document)
        await db.commit()
        
        return {"message": "Document deleted successfully"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/project/{project_id}", response_model=List[DocumentResponse])
async def list_project_documents(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List documents in a project"""
    try:
        # Verify project access
        project = await db.get(Project, uuid.UUID(project_id))
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get documents
        result = await db.execute(
            select(Document)
            .where(Document.project_id == uuid.UUID(project_id))
            .order_by(Document.created_at.desc())
        )
        documents = result.scalars().all()
        
        return [DocumentResponse.from_orm(doc) for doc in documents]
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))