import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from models.database import create_tables
from routers import upload, calculate, compare


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    os.makedirs("uploads", exist_ok=True)
    yield
    # Shutdown (nothing to do)


app = FastAPI(
    title="Company Financial Health Calculator",
    description="Indian Company Financial Health Analysis API — Ind AS / Companies Act 2013",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(calculate.router, prefix="/api/calculate", tags=["Calculate"])
app.include_router(compare.router, prefix="/api/compare", tags=["Compare"])


@app.get("/")
async def root():
    return {
        "message": "Company Financial Health Calculator API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}
