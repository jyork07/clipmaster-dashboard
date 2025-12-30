"""
SQLAlchemy models for Clipmaster Dashboard.

Defines database models for Job, Clip, and Log entities with relationships
and constraints.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()


class Job(Base):
    """
    Job entity representing a video processing job.
    
    Attributes:
        id: Primary key
        title: Job title or name
        description: Detailed job description
        status: Current job status (pending, processing, completed, failed)
        source_url: URL to the source video file
        created_at: Job creation timestamp
        updated_at: Last update timestamp
        started_at: When job processing started
        completed_at: When job processing completed
        progress: Job progress percentage (0-100)
        clips: Relationship to associated Clip entities
        logs: Relationship to associated Log entities
    """
    
    __tablename__ = 'jobs'
    
    class Status(enum.Enum):
        PENDING = 'pending'
        PROCESSING = 'processing'
        COMPLETED = 'completed'
        FAILED = 'failed'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(Status), default=Status.PENDING, nullable=False)
    source_url = Column(String(2048), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    progress = Column(Float, default=0.0, nullable=False)
    
    # Relationships
    clips = relationship('Clip', back_populates='job', cascade='all, delete-orphan')
    logs = relationship('Log', back_populates='job', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Job(id={self.id}, title={self.title!r}, status={self.status.value})>'


class Clip(Base):
    """
    Clip entity representing a video clip extracted from a job.
    
    Attributes:
        id: Primary key
        job_id: Foreign key to parent Job
        title: Clip title or name
        description: Detailed clip description
        start_time: Start timestamp in seconds
        end_time: End timestamp in seconds
        duration: Duration in seconds
        file_path: Path to the generated clip file
        created_at: Clip creation timestamp
        updated_at: Last update timestamp
        size_bytes: File size in bytes
        is_exported: Whether clip has been exported
        job: Relationship to parent Job entity
        logs: Relationship to associated Log entities
    """
    
    __tablename__ = 'clips'
    
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey('jobs.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Float, nullable=False)
    file_path = Column(String(2048), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    size_bytes = Column(Integer, nullable=True)
    is_exported = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    job = relationship('Job', back_populates='clips')
    logs = relationship('Log', back_populates='clip', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Clip(id={self.id}, job_id={self.job_id}, title={self.title!r})>'


class Log(Base):
    """
    Log entity for tracking events and messages related to jobs and clips.
    
    Attributes:
        id: Primary key
        job_id: Foreign key to parent Job (nullable for non-job-specific logs)
        clip_id: Foreign key to parent Clip (nullable for non-clip-specific logs)
        level: Log level (debug, info, warning, error, critical)
        message: Log message text
        created_at: Log creation timestamp
        details: Additional JSON or text details
        job: Relationship to parent Job entity
        clip: Relationship to parent Clip entity
    """
    
    __tablename__ = 'logs'
    
    class Level(enum.Enum):
        DEBUG = 'debug'
        INFO = 'info'
        WARNING = 'warning'
        ERROR = 'error'
        CRITICAL = 'critical'
    
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey('jobs.id'), nullable=True)
    clip_id = Column(Integer, ForeignKey('clips.id'), nullable=True)
    level = Column(Enum(Level), default=Level.INFO, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    details = Column(Text, nullable=True)
    
    # Relationships
    job = relationship('Job', back_populates='logs')
    clip = relationship('Clip', back_populates='logs')
    
    def __repr__(self):
        return f'<Log(id={self.id}, level={self.level.value}, message={self.message[:50]!r})>'
