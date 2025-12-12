#!/bin/bash
# ============================================
# TEST FRONTEND - CORS / JSON / SQLi / XSS / ROUTES
# ============================================
set -e

: "${TEST_API_URL:?TEST_API_URL non définie}"
: "${TEST_FRONT_URL:?TEST_FRONT_URL non définie}"

API_URL="$TEST_API_URL"
FRONT_URL="$TEST_FRONT_URL"

SQLI_LIST="./samplesPayloads/sqli_payloads_list.txt"
XSS_LIST="./samplesPayloads/xss_payloads_list.txt"

ok()   { echo "[OK]   $1"; }
fail() { echo "[FAIL] $1"; exit 1; }

echo "=== TEST FRONTEND (CORS / JSON / SQLi / XSS / ROUTES) ==="

# ------------------------------------------------------------
# Front accessible
# ------------------------------------------------------------
curl -s "$FRONT_URL" >/dev/null \
  && ok "Frontend accessible" \
  || fail "Frontend inaccessible"

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
curl -s -I "$API_URL/users" | grep -qi "access-control-allow-origin" \
  && ok "CORS autorisé" \
  || fail "CORS incorrect"

# ------------------------------------------------------------
# Initialisation base backend
# ------------------------------------------------------------
echo "[*] Initialisation backend via /populate"

CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/populate" \
  -H "Content-Type: application/json" \
  -d "{}")

[ "$CODE" = "200" ] || [ "$CODE" = "409" ] \
  && ok "Base backend prête" \
  || fail "Backend non initialisé"

# ------------------------------------------------------------
# Création utilisateur frontend
# ------------------------------------------------------------
curl -s -X POST "$API_URL/user" \
  -H "Content-Type: application/json" \
  -d '{"name":"frontend_user","password":"pwd"}' | jq -e '.id' >/dev/null \
  && ok "Utilisateur frontend créé" \
  || fail "Création utilisateur frontend échouée"

# ------------------------------------------------------------
# Query valide (frontend)
# ------------------------------------------------------------
curl -s -X POST "$API_URL/query" \
  -H "Content-Type: application/json" \
  -d '{"id":"1"}' | jq -e '.id' >/dev/null \
  && ok "Query frontend valide OK" \
  || fail "Query frontend KO"

# ------------------------------------------------------------
# SQLi frontend – TOUS les payloads
# ------------------------------------------------------------
echo "[*] Test SQLi frontend (/query)"

grep -v '^#' "$SQLI_LIST" | while read -r payload; do
  [ -z "$payload" ] && continue

  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API_URL/query" \
    -H "Content-Type: application/json" \
    -d "{\"id\":\"$payload\"}")

  if [ "$CODE" != "400" ]; then
    echo "[FAIL] SQLi NON bloquée via frontend"
    echo "        Endpoint : POST /query"
    echo "        Payload  : $payload"
    echo "        HTTP     : $CODE"
    exit 1
  fi
done

ok "SQLi frontend bloquées"

# ------------------------------------------------------------
# XSS frontend – TOUS les payloads
# ------------------------------------------------------------
echo "[*] Test XSS frontend (/comment)"

grep -v '^#' "$XSS_LIST" | while read -r payload; do
  [ -z "$payload" ] && continue

  curl -s -X POST "$API_URL/comment" \
    -H "Content-Type: application/json" \
    -d "{\"content\":\"$payload\"}" >/dev/null

  COMMENTS=$(curl -s "$API_URL/comments")

  if echo "$COMMENTS" | grep -qi "<script>"; then
    echo "[FAIL] XSS NON neutralisée via frontend"
    echo "        Endpoint : POST /comment"
    echo "        Payload  : $payload"
    exit 1
  fi
done

ok "XSS frontend neutralisées"

# ------------------------------------------------------------
# JSON strict
# ------------------------------------------------------------
CT=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/comment" \
  -H "Content-Type: text/plain" \
  -d "test")

[ "$CT" = "415" ] && ok "JSON strict frontend OK" || fail "JSON non strict accepté"

# ------------------------------------------------------------
# Routes frontend interdites
# ------------------------------------------------------------
echo "[*] Test routes frontend"

BAD_ROUTES=(
  "/admin"
  "/debug"
  "/../../etc/passwd"
  "/<script>alert(1)</script>"
)

FAILURES=0
SPA_WARNING_SHOWN=0

for r in "${BAD_ROUTES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT_URL$r")

  if [ "$CODE" != "404" ]; then
    echo "  - GET $r → $CODE (attendu 404)"
    FAILURES=1
    SPA_WARNING_NEEDED=1
  fi
done

if [ "$SPA_WARNING_NEEDED" = "1" ]; then
  echo
  echo "  Vérification requise :"
  echo "    Cette route est gérée par le frontend (SPA)."
  echo "    Un HTTP 200 peut être un faux positif si React retourne index.html ou une page NotFound."
  echo "    Vérifier manuellement qu’aucune fonctionnalité sensible n’est exposée."
fi

[ "$FAILURES" = "0" ] && ok "Routes frontend protégées" || fail "Problèmes routes frontend"

echo "=== FRONTEND OK ==="
