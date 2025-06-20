FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy requirements first for better layer caching
COPY backend/requirements.txt ./backend/
COPY frontend/package*.json ./frontend/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r backend/requirements.txt && \
    pip install supervisor

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Expose port (Render will provide PORT environment variable)
EXPOSE $PORT

# Create necessary directories and set permissions
RUN mkdir -p /var/log/supervisor

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Start command
CMD ["supervisord", "-c", "/etc/supervisord.conf"]