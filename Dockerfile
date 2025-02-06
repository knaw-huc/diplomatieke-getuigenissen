FROM node:alpine as frontend-build

WORKDIR /app
COPY ./src/frontend/ /app
RUN npm install && npm run build

FROM python:3.12-slim

ENV PYTHONPATH /app
ENV PYTHONUNBUFFERED 1

RUN pip3 install poetry

WORKDIR /app
COPY pyproject.toml /app

RUN poetry config virtualenvs.create false && \
    poetry install --with prod

COPY ./src/ /app
COPY ./entrypoint.sh /app
COPY --from=frontend-build /app/dist /app/frontend/dist

EXPOSE 5000

CMD ["/app/entrypoint.sh"]
