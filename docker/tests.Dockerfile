# docker/tests.Dockerfile

FROM alpine:latest

# Outils nécessaires aux tests
RUN apk add --no-cache bash curl jq

WORKDIR /tests

# Scripts de tests
COPY tests/test_backend.sh .
COPY tests/test_frontend.sh .
COPY tests/samplesPayloads ./samplesPayloads

RUN chmod +x test_backend.sh test_frontend.sh

# Lancer bash par défaut pour permettre :
# - tests automatiques
# - tests manuels
ENTRYPOINT ["/bin/bash"]
