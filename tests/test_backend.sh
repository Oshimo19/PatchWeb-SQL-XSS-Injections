#!/bin/bash
# ============================================
# TEST BACKEND - SQLi / XSS / JSON / METHODS / ROUTES
# ============================================
set -e

: "${TEST_API_URL:?TEST_API_URL non définie}"
API_URL="$TEST_API_URL"

SQLI_LIST="./samplesPayloads/sqli_payloads_list.txt"
XSS_LIST="./samplesPayloads/xss_payloads_list.txt"

ok()   { echo "[OK]   $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

echo "=== TEST BACKEND (SQLi / XSS / METHODS / ROUTES) ==="

# ------------------------------------------------------------
# Healthcheck
# ------------------------------------------------------------
curl -s "$API_URL/health" | jq -e '.status=="ok"' >/dev/null \
  && ok "Healthcheck OK" \
  || fail "Healthcheck KO"

# ------------------------------------------------------------
# Initialisation DB
# ------------------------------------------------------------
echo "[*] Initialisation base via /populate"

CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/populate" \
  -H "Content-Type: application/json" \
  -d "{}")

[ "$CODE" = "200" ] || [ "$CODE" = "409" ] \
  && ok "Base initialisée" \
  || fail "Erreur /populate ($CODE)"

# ------------------------------------------------------------
# Création utilisateur valide
# ------------------------------------------------------------
curl -s -X POST "$API_URL/user" \
  -H "Content-Type: application/json" \
  -d '{"name":"user1","password":"pass1"}' | jq -e '.id' >/dev/null \
  && ok "Utilisateur valide créé" \
  || fail "Création utilisateur échouée"

# ------------------------------------------------------------
# SQLi – TOUS les payloads
# ------------------------------------------------------------
echo "[*] Test SQLi payloads (/query)"

grep -v '^#' "$SQLI_LIST" | while read -r payload; do
  [ -z "$payload" ] && continue

  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API_URL/query" \
    -H "Content-Type: application/json" \
    -d "{\"id\":\"$payload\"}")

  if [ "$CODE" != "400" ]; then
    echo "[FAIL] SQLi NON bloquée"
    echo "        Endpoint : POST /query"
    echo "        Payload  : $payload"
    echo "        HTTP     : $CODE"
    exit 1
  fi
done

ok "Toutes les SQLi sont bloquées"

# ------------------------------------------------------------
# XSS – TOUS les payloads
# ------------------------------------------------------------
echo "[*] Test XSS payloads (/comment)"

grep -v '^#' "$XSS_LIST" | while read -r payload; do
  [ -z "$payload" ] && continue

  curl -s -X POST "$API_URL/comment" \
    -H "Content-Type: application/json" \
    -d "{\"content\":\"$payload\"}" >/dev/null

  COMMENTS=$(curl -s "$API_URL/comments")

  if echo "$COMMENTS" | grep -qi "<script>"; then
    echo "[FAIL] XSS NON neutralisée"
    echo "        Endpoint : POST /comment"
    echo "        Payload  : $payload"
    exit 1
  fi
done

ok "Toutes les XSS sont neutralisées"

# ------------------------------------------------------------
# Content-Type strict
# ------------------------------------------------------------
CT=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/comment" \
  -H "Content-Type: text/plain" \
  -d "test")

[ "$CT" = "415" ] && ok "JSON strict OK" || fail "JSON non strict accepté"

# ------------------------------------------------------------
# Méthodes interdites
# ------------------------------------------------------------
METHOD=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/users")

[ "$METHOD" = "404" ] || [ "$METHOD" = "405" ] \
  && ok "Méthodes interdites bloquées" \
  || fail "Méthodes interdites acceptées"

# ------------------------------------------------------------
# Routes backend interdites
# ------------------------------------------------------------
echo "[*] Test routes backend interdites"

BAD_ROUTES=(
  "/admin"
  "/debug"
  "/config"
  "/../../etc/passwd"
  "/<script>alert(1)</script>"
)

for r in "${BAD_ROUTES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$r")
  if [ "$CODE" != "404" ]; then
    echo "[FAIL] Route backend exposée : GET $r ($CODE)"
    exit 1
  fi
done

ok "Routes backend protégées"

echo "=== BACKEND OK ==="
