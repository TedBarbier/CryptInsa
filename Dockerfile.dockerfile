FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Set workdir and copy all project files
WORKDIR /app
COPY . /app

# Create and activate virtualenv, install Python dependencies
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r backend/requirements.txt

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Expose frontend and backend ports
EXPOSE 8000 5000

# Install supervisor
WORKDIR /app
RUN pip install --no-cache-dir supervisor

# Supervisor config
COPY supervisord.conf /etc/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisord.conf"]