# שלב 1: בנייה
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# העתקת קבצי הפתרון וקבצי הפרויקטים הרלוונטיים
COPY Backend.API/Backend.API.sln Backend.API/
COPY Backend.API/Backend.API.csproj Backend.API/
COPY ../Backend.CORE/Backend.CORE.csproj Backend.CORE/
COPY ../Backend.DATA/Backend.DATA.csproj Backend.DATA/
COPY ../Backend.SERVER/Backend.SERVER.csproj Backend.SERVER/

# שחזור חבילות לפרויקט Backend.API
RUN dotnet restore Backend.API/Backend.API.csproj

# העתקת שאר הקבצים
COPY Backend.API/. Backend.API/
COPY ../Backend.CORE/. Backend.CORE/
COPY ../Backend.DATA/. Backend.DATA/
COPY ../Backend.SERVER/. Backend.SERVER/

# בניית ופרסום Backend.API בלבד
WORKDIR /src/Backend.API
RUN dotnet publish -c Release -o /app

# שלב 2: הרצה
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "Backend.API.dll"]
