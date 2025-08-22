from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Raw components
    DB_HOST: str | None = None
    DB_PORT: int | None = None
    DB_USER: str | None = None
    DB_PASS: str | None = None
    DB_NAME: str | None = None

    # Final assembled URL (fallback default if env not set)
    DATABASE_URL: str | None = None
    API_V1_STR: str = "/api/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        env_file_encoding="utf-8",
        extra="allow",
        populate_by_name=True,
    )

settings = Settings()

# Assemble DATABASE_URL if not explicitly provided but parts exist
if not settings.DATABASE_URL and settings.DB_HOST and settings.DB_USER and settings.DB_PASS and settings.DB_NAME:
    settings.DATABASE_URL = (
        f"postgresql://{settings.DB_USER}:{settings.DB_PASS}@{settings.DB_HOST}:{settings.DB_PORT or 5432}/{settings.DB_NAME}"
    )
