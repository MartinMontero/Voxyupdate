import pytest
import asyncio
from unittest.mock import Mock, patch
import tempfile
import os

from app.services.document_processor import DocumentProcessor
from app.services.audio_generator import AudioGenerator

class TestDocumentProcessor:
    """Unit tests for document processing"""
    
    def setup_method(self):
        self.processor = DocumentProcessor()
    
    def test_chunk_creation(self):
        """Test text chunking functionality"""
        text = "This is a test document. " * 100  # Create long text
        chunks = self.processor._create_chunks(text)
        
        assert len(chunks) > 1
        assert all(len(chunk.split()) <= self.processor.chunk_size for chunk in chunks)
        print("✅ Text chunking works correctly")
    
    async def test_pdf_extraction(self):
        """Test PDF text extraction"""
        # Create a simple test file
        test_content = "This is test content for PDF extraction testing."
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(test_content)
            temp_path = f.name
        
        try:
            # Test text file extraction (simpler than PDF for testing)
            extracted = await self.processor._extract_txt_text(temp_path)
            assert extracted.strip() == test_content
            print("✅ Text extraction works correctly")
        finally:
            os.unlink(temp_path)

class TestAudioGenerator:
    """Unit tests for audio generation"""
    
    def setup_method(self):
        self.generator = AudioGenerator()
    
    async def test_concept_extraction(self):
        """Test key concept extraction"""
        # Mock documents
        mock_docs = [
            Mock(content="This document discusses artificial intelligence and machine learning."),
            Mock(content="The research focuses on natural language processing and deep learning.")
        ]
        
        concepts = await self.generator._extract_key_concepts(mock_docs)
        
        assert isinstance(concepts, list)
        assert len(concepts) > 0
        print("✅ Concept extraction works correctly")
    
    async def test_dialogue_generation(self):
        """Test dialogue generation"""
        outline = "Introduction to AI concepts and their applications"
        settings = {
            'personas': [
                {'name': 'Dr. Smith', 'role': 'Expert', 'personality': 'Academic', 'speakingStyle': 'Formal'},
                {'name': 'Alex', 'role': 'Student', 'personality': 'Curious', 'speakingStyle': 'Casual'}
            ]
        }
        
        dialogue = await self.generator._generate_dialogue(outline, settings)
        
        assert isinstance(dialogue, list)
        assert len(dialogue) > 0
        assert all('speaker' in item and 'text' in item for item in dialogue)
        print("✅ Dialogue generation works correctly")

async def run_unit_tests():
    """Run all unit tests"""
    print("🧪 Starting Unit Tests")
    print("=" * 30)
    
    # Test document processor
    doc_tests = TestDocumentProcessor()
    doc_tests.setup_method()
    doc_tests.test_chunk_creation()
    await doc_tests.test_pdf_extraction()
    
    # Test audio generator
    audio_tests = TestAudioGenerator()
    audio_tests.setup_method()
    await audio_tests.test_concept_extraction()
    await audio_tests.test_dialogue_generation()
    
    print("\n✅ All unit tests passed!")

if __name__ == "__main__":
    asyncio.run(run_unit_tests())