# ---------- BUILD (Maven + JDK 21) ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -e -B -DskipTests package

# ---------- RUNTIME (JRE 21) ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Render define a variável PORT automaticamente
ENV PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

COPY --from=build /app/target/*.jar app.jar

# Healthcheck simples usando Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:${PORT}/actuator/health | grep -q '"status":"UP"' || exit 1

EXPOSE ${PORT}

# 👇 AQUI é a mudança: usar -cp + classe principal
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -cp app.jar com.example.app.App --server.port=${PORT}"]
