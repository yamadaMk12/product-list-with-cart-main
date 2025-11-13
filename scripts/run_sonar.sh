#!/bin/bash
set -e

echo "=== Lancement de l'analyse SonarQube ==="
sonar-scanner \
  -Dsonar.projectKey=ISEKAIMK \
  -Dsonar.projectName=ISEKAI \
  -Dsonar.projectVersion=1.0 \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=$SONAR_TOKEN \
  -Dsonar.sourceEncoding=UTF-8 \
