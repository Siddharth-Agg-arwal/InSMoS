FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build dependencies, install Python deps, then remove build deps and clean up
COPY Pipfile Pipfile.lock ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && pip install --upgrade pipenv \
    && pipenv install --deploy --system \
    && apt-get purge -y --auto-remove gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /root/.cache/pip

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]