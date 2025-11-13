#!/bin/bash
set -e

echo "=== Lancement de l'analyse SonarQube ==="
sonar-scanner \
  -Dsonar.projectKey=mon-projet \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=$SONAR_TOKEN
