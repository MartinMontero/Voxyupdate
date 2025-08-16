from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://postgres:password@localhost/voxy"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # AI Services
    anthropic_api_key: Optional[str] = None
    elevenlabs_api_key: Optional[str] = None
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Storage
    upload_dir: str = "./uploads"
    audio_dir: str = "./audio"
    max_file_size: int = 50 * 1024 * 1024  # 50MB
    
    # Generation Settings
    max_concurrent_generations: int = 5
    default_generation_timeout: int = 600  # 10 minutes
    
    class Config:
        env_file = ".env"

settings = Settings()