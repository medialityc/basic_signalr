FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiamos sólo el .csproj desde su ruta dentro del contexto raíz
COPY src/SignalR.Api/SignalR.Api.csproj ./
RUN dotnet restore

# Copiamos el código fuente de la API
COPY src/SignalR.Api/. .

RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false
    
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8000
COPY --from=build /app/publish .

EXPOSE 8000

ENTRYPOINT ["dotnet", "SignalR.Api.dll"]
