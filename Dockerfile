FROM node:alpine as frontend-build

WORKDIR /app
COPY ./src/frontend/ /app
RUN npm install && npm run build

FROM python:3.11-slim

ENV PYTHONPATH /app
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y procps locales gettext

RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen &&\
  echo "de_DE.UTF-8 UTF-8" >> /etc/locale.gen &&\
  locale-gen

ENV LC_ALL de_DE.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

WORKDIR /app
COPY ./src/ /app
COPY ./entrypoint.sh /app
COPY ./requirements.txt /app
COPY --from=frontend-build /app/dist /app/frontend/dist

RUN pip3 install --trusted-host pypi.python.org -r /app/requirements.txt &&\
    pip3 install --trusted-host pypi.python.org pyuwsgi

EXPOSE 5000

CMD ["/app/entrypoint.sh"]
