FROM nginx:alpine
# Limpia archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copia únicamente el contenido de la carpeta del cliente al root público
COPY src/SignalR.Client/ /usr/share/nginx/html/
EXPOSE 80
