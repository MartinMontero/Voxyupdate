import asyncio
import aiofiles
from typing import List, Dict, Any
import PyPDF2
from docx import Document as DocxDocument
import markdown
from bs4 import BeautifulSoup
import httpx
from sentence_transformers import SentenceTransformer
import numpy as np
from ..models import Document, DocumentChunk
from ..database import AsyncSessionLocal
from sqlalchemy import select

class DocumentProcessor:
    def __init__(self):
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.chunk_size = 1000
        self.chunk_overlap = 200
    
    async def process_document(self, document_id: str) -> bool:
        """Process a document: extract text, chunk, and generate embeddings"""
        try:
            async with AsyncSessionLocal() as db:
                # Get document
                result = await db.execute(select(Document).where(Document.id == document_id))
                document = result.scalar_one_or_none()
                
                if not document:
                    return False
                
                # Update status
                document.status = "processing"
                await db.commit()
                
                # Extract text based on file type
                text_content = await self._extract_text(document)
                
                if not text_content:
                    document.status = "error"
                    await db.commit()
                    return False
                
                # Store extracted content
                document.content = text_content
                
                # Create chunks
                chunks = self._create_chunks(text_content)
                
                # Generate embeddings and save chunks
                for i, chunk_text in enumerate(chunks):
                    embedding = self.embedding_model.encode(chunk_text).tolist()
                    
                    chunk = DocumentChunk(
                        document_id=document.id,
                        content=chunk_text,
                        chunk_index=i,
                        embedding=embedding,
                        metadata={"chunk_size": len(chunk_text)}
                    )
                    db.add(chunk)
                
                document.status = "ready"
                await db.commit()
                return True
                
        except Exception as e:
            print(f"Error processing document {document_id}: {e}")
            async with AsyncSessionLocal() as db:
                result = await db.execute(select(Document).where(Document.id == document_id))
                document = result.scalar_one_or_none()
                if document:
                    document.status = "error"
                    await db.commit()
            return False
    
    async def _extract_text(self, document: Document) -> str:
        """Extract text from different file types"""
        file_path = f"./uploads/{document.filename}"
        
        try:
            if document.file_type == "application/pdf":
                return await self._extract_pdf_text(file_path)
            elif document.file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return await self._extract_docx_text(file_path)
            elif document.file_type == "text/plain":
                return await self._extract_txt_text(file_path)
            elif document.file_type == "text/markdown":
                return await self._extract_markdown_text(file_path)
            else:
                return ""
        except Exception as e:
            print(f"Error extracting text from {file_path}: {e}")
            return ""
    
    async def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text.strip()
    
    async def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            doc = DocxDocument(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            return ""
    
    async def _extract_txt_text(self, file_path: str) -> str:
        """Extract text from TXT"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()
        except Exception as e:
            print(f"Error reading TXT: {e}")
            return ""
    
    async def _extract_markdown_text(self, file_path: str) -> str:
        """Extract text from Markdown"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                md_content = await file.read()
                html = markdown.markdown(md_content)
                soup = BeautifulSoup(html, 'html.parser')
                return soup.get_text()
        except Exception as e:
            print(f"Error reading Markdown: {e}")
            return ""
    
    def _create_chunks(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), self.chunk_size - self.chunk_overlap):
            chunk_words = words[i:i + self.chunk_size]
            chunk_text = " ".join(chunk_words)
            chunks.append(chunk_text)
            
            if i + self.chunk_size >= len(words):
                break
        
        return chunks
    
    async def search_similar_chunks(self, query: str, document_ids: List[str], limit: int = 10) -> List[Dict[str, Any]]:
        """Search for similar chunks using embeddings"""
        query_embedding = self.embedding_model.encode(query).tolist()
        
        async with AsyncSessionLocal() as db:
            # Get all chunks for the documents
            result = await db.execute(
                select(DocumentChunk, Document)
                .join(Document)
                .where(Document.id.in_(document_ids))
            )
            chunks_with_docs = result.all()
            
            # Calculate similarities
            similarities = []
            for chunk, doc in chunks_with_docs:
                if chunk.embedding:
                    similarity = np.dot(query_embedding, chunk.embedding)
                    similarities.append({
                        "chunk": chunk,
                        "document": doc,
                        "similarity": similarity
                    })
            
            # Sort by similarity and return top results
            similarities.sort(key=lambda x: x["similarity"], reverse=True)
            return similarities[:limit]