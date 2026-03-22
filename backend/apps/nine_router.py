"""Auto-start and manage 9Router subprocess.

9Router is a free AI subscription proxy that lets users connect their
Claude/ChatGPT/Gemini subscriptions to OpenSwarm without API keys.

It runs silently in the background on port 20128 and exposes an
OpenAI-compatible API at localhost:20128/v1.
"""

import asyncio
import logging
import os
import shutil
import subprocess

import httpx

logger = logging.getLogger(__name__)

NINE_ROUTER_PORT = 20128
NINE_ROUTER_URL = f"http://localhost:{NINE_ROUTER_PORT}"
NINE_ROUTER_API = f"{NINE_ROUTER_URL}/api"
NINE_ROUTER_V1 = f"{NINE_ROUTER_URL}/v1"

_process: subprocess.Popen | None = None


def is_running() -> bool:
    """Check if 9Router is running."""
    try:
        r = httpx.get(f"{NINE_ROUTER_V1}/models", timeout=2.0)
        return r.status_code == 200
    except Exception:
        return False


async def ensure_running():
    """Start 9Router if not already running."""
    global _process
    if is_running():
        logger.info("9Router already running on port %d", NINE_ROUTER_PORT)
        return

    npx = shutil.which("npx")
    if not npx:
        logger.warning("npx not found — cannot auto-start 9Router. Install Node.js or run 9Router manually.")
        return

    logger.info("Starting 9Router on port %d...", NINE_ROUTER_PORT)
    try:
        env = {**os.environ, "PORT": str(NINE_ROUTER_PORT)}
        _process = subprocess.Popen(
            [npx, "9router"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=env,
        )

        # Wait up to 15 seconds for it to start
        for _ in range(30):
            await asyncio.sleep(0.5)
            if is_running():
                logger.info("9Router started successfully")
                return

        logger.warning("9Router did not start within 15 seconds")
    except Exception as e:
        logger.warning(f"Failed to start 9Router: {e}")


def stop():
    """Stop the 9Router subprocess."""
    global _process
    if _process:
        try:
            _process.terminate()
            _process.wait(timeout=5)
        except Exception:
            try:
                _process.kill()
            except Exception:
                pass
        _process = None
        logger.info("9Router stopped")


# ---------------------------------------------------------------------------
# API proxy helpers — call 9Router's API from OpenSwarm
# ---------------------------------------------------------------------------

async def get_providers() -> list[dict]:
    """Get all providers and their connection status from 9Router."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{NINE_ROUTER_API}/providers")
            if r.status_code == 200:
                return r.json()
    except Exception as e:
        logger.debug(f"9Router providers fetch failed: {e}")
    return []


async def start_oauth(provider: str) -> dict:
    """Start OAuth device flow for a provider.

    Returns: {user_code, verification_uri, device_code, ...}
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(f"{NINE_ROUTER_API}/oauth/{provider}/device-code")
        r.raise_for_status()
        return r.json()


async def poll_oauth(provider: str, device_code: str) -> dict:
    """Poll for OAuth completion.

    Returns: {status: "pending"} or {status: "connected", connection: {...}}
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.post(
            f"{NINE_ROUTER_API}/oauth/{provider}/poll",
            json={"deviceCode": device_code},
        )
        r.raise_for_status()
        return r.json()


async def get_models() -> list[dict]:
    """Get all available models from 9Router."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{NINE_ROUTER_V1}/models")
            if r.status_code == 200:
                data = r.json()
                models = data.get("data", [])
                return [
                    {
                        "value": m.get("id", ""),
                        "label": m.get("id", "").split("/")[-1] if "/" in m.get("id", "") else m.get("id", ""),
                        "context_window": 200_000,
                        "provider": m.get("owned_by", "subscription"),
                    }
                    for m in models
                ]
    except Exception as e:
        logger.debug(f"9Router models fetch failed: {e}")
    return []
