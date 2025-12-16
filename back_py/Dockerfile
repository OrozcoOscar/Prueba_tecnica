FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY back_py/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY back_py /app/back_py

CMD ["python", "-m", "back_py.main"]
