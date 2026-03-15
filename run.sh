#!/bin/bash
# The comment above is shebang, DO NOT REMOVE
SCRIPT_ABSPATH="$(readlink -f "${BASH_SOURCE[0]}")"
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/\r//g' "$SCRIPT_ABSPATH"
else
    sed -i 's/\r//g' "$SCRIPT_ABSPATH"
fi
chmod +x "$SCRIPT_ABSPATH"

PROJECT_ROOT="$(dirname "$SCRIPT_ABSPATH")"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
RESET='\033[0m'

BACKEND_PID=""
FRONTEND_PID=""
SHUTTING_DOWN=false

kill_tree() {
    local pid=$1 sig=${2:-TERM}
    local children
    children=$(pgrep -P "$pid" 2>/dev/null)
    for child in $children; do
        kill_tree "$child" "$sig"
    done
    kill -"$sig" "$pid" 2>/dev/null
}

cleanup() {
    $SHUTTING_DOWN && return
    SHUTTING_DOWN=true

    echo ""
    echo -e "${YELLOW}${BOLD}Gracefully shutting down all services...${RESET}"

    for pid in $BACKEND_PID $FRONTEND_PID; do
        [[ -n "$pid" ]] && kill_tree "$pid" TERM
    done

    local elapsed=0
    while (( elapsed < 5 )); do
        local alive=false
        for pid in $BACKEND_PID $FRONTEND_PID; do
            [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null && alive=true
        done
        $alive || break
        sleep 1
        ((elapsed++))
    done

    for pid in $BACKEND_PID $FRONTEND_PID; do
        [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null && kill_tree "$pid" KILL
    done

    wait 2>/dev/null
    echo -e "${GREEN}${BOLD}All services stopped.${RESET}"
}

trap 'cleanup; exit 0' INT TERM
trap cleanup EXIT

# --- Start backend ---
echo -e "${BLUE}${BOLD}[backend]${RESET}  Starting backend server..."
bash "$PROJECT_ROOT/backend/run.sh" > >(
    while IFS= read -r line; do
        printf "${BLUE}${BOLD}[backend]${RESET}  %s\n" "$line"
    done
) 2>&1 &
BACKEND_PID=$!

# --- Wait for backend to become healthy ---
echo -e "${YELLOW}${BOLD}Waiting for backend (http://localhost:8324) to be ready...${RESET}"
MAX_WAIT=120
elapsed=0
while (( elapsed < MAX_WAIT )); do
    if curl -s -o /dev/null --connect-timeout 1 http://localhost:8324/ 2>/dev/null; then
        echo -e "${GREEN}${BOLD}Backend is ready!${RESET}"
        break
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${RED}${BOLD}Backend process exited before becoming ready.${RESET}"
        exit 1
    fi
    sleep 2
    ((elapsed += 2))
done

if (( elapsed >= MAX_WAIT )); then
    echo -e "${RED}${BOLD}Backend did not become ready within ${MAX_WAIT}s. Aborting.${RESET}"
    exit 1
fi

# --- Start frontend ---
echo -e "${GREEN}${BOLD}[frontend]${RESET} Starting frontend dev server..."
bash "$PROJECT_ROOT/frontend/run.sh" > >(
    while IFS= read -r line; do
        printf "${GREEN}${BOLD}[frontend]${RESET} %s\n" "$line"
    done
) 2>&1 &
FRONTEND_PID=$!

echo ""
echo -e "${BOLD}Both services are running. Press Ctrl+C to stop.${RESET}"
echo -e "  Backend:  ${BLUE}http://localhost:8324${RESET}"
echo -e "  Frontend: ${GREEN}http://localhost:3000${RESET}"
echo ""

# --- Monitor: if either service exits, tear down both ---
while ! $SHUTTING_DOWN; do
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${RED}${BOLD}Backend process exited unexpectedly. Shutting down...${RESET}"
        exit 1
    fi
    if [[ -n "$FRONTEND_PID" ]] && ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo -e "${RED}${BOLD}Frontend process exited unexpectedly. Shutting down...${RESET}"
        exit 1
    fi
    sleep 3
done
