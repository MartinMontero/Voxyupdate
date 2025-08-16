import asyncio
import os
from typing import List, Dict, Any, Optional
import httpx
from elevenlabs import generate, save, voices
from pydub import AudioSegment
import tempfile
from anthropic import Anthropic
from ..models import AudioGeneration, Project, Document
from ..database import AsyncSessionLocal
from ..config import settings
from .document_processor import DocumentProcessor

class AudioGenerator:
    def __init__(self):
        self.anthropic = Anthropic(api_key=settings.anthropic_api_key) if settings.anthropic_api_key else None
        self.document_processor = DocumentProcessor()
    
    async def generate_podcast(self, generation_id: str) -> bool:
        """Generate a complete podcast from documents"""
        try:
            async with AsyncSessionLocal() as db:
                # Get generation details
                generation = await db.get(AudioGeneration, generation_id)
                if not generation:
                    return False
                
                # Update status
                generation.status = "processing"
                generation.progress = 5.0
                generation.current_step = "Analyzing documents..."
                await db.commit()
                
                # Get project and documents
                project = await db.get(Project, generation.project_id)
                documents = project.documents
                
                if not documents:
                    generation.status = "failed"
                    generation.error_message = "No documents found"
                    await db.commit()
                    return False
                
                # Step 1: Extract key concepts (20%)
                generation.progress = 20.0
                generation.current_step = "Extracting key concepts..."
                await db.commit()
                
                key_concepts = await self._extract_key_concepts(documents)
                
                # Step 2: Generate conversation outline (40%)
                generation.progress = 40.0
                generation.current_step = "Creating conversation outline..."
                await db.commit()
                
                outline = await self._create_conversation_outline(
                    key_concepts, 
                    generation.settings
                )
                
                # Step 3: Generate dialogue (60%)
                generation.progress = 60.0
                generation.current_step = "Generating dialogue..."
                await db.commit()
                
                dialogue = await self._generate_dialogue(outline, generation.settings)
                
                # Step 4: Synthesize audio (80%)
                generation.progress = 80.0
                generation.current_step = "Synthesizing audio..."
                await db.commit()
                
                audio_path = await self._synthesize_audio(dialogue, generation.settings)
                
                # Step 5: Finalize (100%)
                generation.progress = 100.0
                generation.current_step = "Complete!"
                generation.status = "completed"
                generation.audio_url = audio_path
                generation.duration = await self._get_audio_duration(audio_path)
                await db.commit()
                
                return True
                
        except Exception as e:
            print(f"Error generating podcast {generation_id}: {e}")
            async with AsyncSessionLocal() as db:
                generation = await db.get(AudioGeneration, generation_id)
                if generation:
                    generation.status = "failed"
                    generation.error_message = str(e)
                    await db.commit()
            return False
    
    async def _extract_key_concepts(self, documents: List[Document]) -> List[str]:
        """Extract key concepts from documents using AI"""
        if not self.anthropic:
            return ["Sample concept 1", "Sample concept 2", "Sample concept 3"]
        
        # Combine document content
        combined_content = "\n\n".join([doc.content for doc in documents if doc.content])
        
        # Truncate if too long (Claude has token limits)
        if len(combined_content) > 50000:
            combined_content = combined_content[:50000] + "..."
        
        prompt = f"""
        Analyze the following documents and extract the 5-10 most important key concepts, themes, or topics that would make for an engaging podcast discussion.

        Documents:
        {combined_content}

        Please provide a list of key concepts, one per line, that capture the essence of these documents.
        """
        
        try:
            response = self.anthropic.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            concepts = response.content[0].text.strip().split('\n')
            return [concept.strip('- ') for concept in concepts if concept.strip()]
            
        except Exception as e:
            print(f"Error extracting concepts: {e}")
            return ["Document analysis", "Key findings", "Important insights"]
    
    async def _create_conversation_outline(self, concepts: List[str], settings: Dict[str, Any]) -> str:
        """Create a conversation outline"""
        if not self.anthropic:
            return "Sample conversation outline with introduction, main discussion points, and conclusion."
        
        personas = settings.get('personas', [])
        duration = settings.get('duration', '10-15')
        tone = settings.get('tone', 'balanced')
        
        persona_descriptions = "\n".join([
            f"- {p['name']} ({p['role']}): {p['personality']}"
            for p in personas
        ])
        
        concepts_text = "\n".join([f"- {concept}" for concept in concepts])
        
        prompt = f"""
        Create a detailed conversation outline for a {duration} minute podcast discussion between these personas:

        {persona_descriptions}

        Key concepts to cover:
        {concepts_text}

        Tone: {tone}

        The outline should include:
        1. Opening introduction
        2. 3-5 main discussion segments
        3. Natural transitions between topics
        4. Closing summary

        Make it engaging and ensure each persona has distinct contributions based on their role and personality.
        """
        
        try:
            response = self.anthropic.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return response.content[0].text.strip()
            
        except Exception as e:
            print(f"Error creating outline: {e}")
            return "Sample outline with introduction, discussion, and conclusion."
    
    async def _generate_dialogue(self, outline: str, settings: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate actual dialogue from outline"""
        if not self.anthropic:
            # Return sample dialogue
            personas = settings.get('personas', [])
            return [
                {"speaker": personas[0]['name'], "text": "Welcome to today's discussion! Let's dive into these fascinating topics."},
                {"speaker": personas[1]['name'], "text": "Absolutely! I'm excited to explore these key insights with you."},
                {"speaker": personas[0]['name'], "text": "The research presents some compelling evidence that challenges conventional thinking."},
                {"speaker": personas[1]['name'], "text": "That's a great point. What I find particularly interesting is how this connects to broader trends."},
            ]
        
        personas = settings.get('personas', [])
        persona_descriptions = "\n".join([
            f"- {p['name']} ({p['role']}): {p['personality']} - Speaking style: {p['speakingStyle']}"
            for p in personas
        ])
        
        prompt = f"""
        Based on this outline, generate a natural conversation between these personas:

        {persona_descriptions}

        Outline:
        {outline}

        Generate the dialogue in this format:
        SPEAKER_NAME: [dialogue text]

        Requirements:
        - Make it sound natural and conversational
        - Include interruptions, agreements, and disagreements
        - Stay true to each persona's speaking style
        - Include natural transitions and reactions
        - Make it engaging and informative
        """
        
        try:
            response = self.anthropic.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            dialogue_text = response.content[0].text.strip()
            
            # Parse dialogue into structured format
            dialogue = []
            for line in dialogue_text.split('\n'):
                if ':' in line:
                    speaker, text = line.split(':', 1)
                    dialogue.append({
                        "speaker": speaker.strip(),
                        "text": text.strip()
                    })
            
            return dialogue
            
        except Exception as e:
            print(f"Error generating dialogue: {e}")
            return [{"speaker": "Host", "text": "Sample dialogue generated."}]
    
    async def _synthesize_audio(self, dialogue: List[Dict[str, str]], settings: Dict[str, Any]) -> str:
        """Synthesize audio from dialogue"""
        if not settings.elevenlabs_api_key:
            # Create a dummy audio file for demo
            audio_filename = f"demo_audio_{asyncio.current_task().get_name()}.mp3"
            audio_path = os.path.join(settings.audio_dir, audio_filename)
            
            # Create a simple tone as placeholder
            tone = AudioSegment.sine(440, duration=30000)  # 30 seconds
            tone.export(audio_path, format="mp3")
            return audio_path
        
        try:
            audio_segments = []
            personas = settings.get('personas', [])
            
            # Create voice mapping
            voice_map = {}
            for persona in personas:
                voice_map[persona['name']] = persona.get('voiceId', 'default')
            
            for segment in dialogue:
                speaker = segment['speaker']
                text = segment['text']
                voice_id = voice_map.get(speaker, 'default')
                
                # Generate audio for this segment
                audio = generate(
                    text=text,
                    voice=voice_id,
                    model="eleven_monolingual_v1"
                )
                
                # Save to temporary file
                with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
                    save(audio, temp_file.name)
                    segment_audio = AudioSegment.from_mp3(temp_file.name)
                    audio_segments.append(segment_audio)
                    os.unlink(temp_file.name)
                
                # Add pause between speakers
                pause = AudioSegment.silent(duration=500)  # 0.5 second pause
                audio_segments.append(pause)
            
            # Combine all segments
            final_audio = sum(audio_segments)
            
            # Export final audio
            audio_filename = f"podcast_{asyncio.current_task().get_name()}.mp3"
            audio_path = os.path.join(settings.audio_dir, audio_filename)
            final_audio.export(audio_path, format="mp3")
            
            return audio_path
            
        except Exception as e:
            print(f"Error synthesizing audio: {e}")
            # Fallback to demo audio
            return await self._create_demo_audio()
    
    async def _create_demo_audio(self) -> str:
        """Create demo audio file"""
        audio_filename = f"demo_audio_{asyncio.current_task().get_name()}.mp3"
        audio_path = os.path.join(settings.audio_dir, audio_filename)
        
        # Create a simple tone
        tone = AudioSegment.sine(440, duration=30000)  # 30 seconds
        tone.export(audio_path, format="mp3")
        return audio_path
    
    async def _get_audio_duration(self, audio_path: str) -> int:
        """Get audio duration in seconds"""
        try:
            audio = AudioSegment.from_mp3(audio_path)
            return len(audio) // 1000  # Convert to seconds
        except:
            return 30  # Default duration