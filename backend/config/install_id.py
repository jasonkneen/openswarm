"""Per-install identifier.

A UUID4 generated on first run, persisted at ``<DATA_ROOT>/install_id``
with 0600 perms. Used to bind an in-flight OAuth claim to the install
that started it, so a leaked session_id alone is useless.

Not a secret. Not a user identity. Not stable across reinstalls
(reinstalling generates a new ID, by design — the previous install's
in-flight OAuth flows shouldn't follow the user across reinstalls).
"""

from __future__ import annotations

import os
import uuid

from backend.config.paths import DATA_ROOT

_INSTALL_ID_FILE = os.path.join(DATA_ROOT, "install_id")
_cached: str | None = None


def get_install_id() -> str:
    """Return the persistent install_id, generating + persisting on first call.

    Idempotent across processes — if the file already exists we read it.
    Concurrent first-call from two processes is safe: both write a UUID,
    last-writer-wins, neither side cares which one is canonical.
    """
    global _cached
    if _cached:
        return _cached

    try:
        with open(_INSTALL_ID_FILE, "r", encoding="utf-8") as f:
            existing = f.read().strip()
            if _looks_like_uuid(existing):
                _cached = existing
                return _cached
    except FileNotFoundError:
        pass
    except Exception:
        # Corrupt file — overwrite below.
        pass

    fresh = str(uuid.uuid4())
    os.makedirs(os.path.dirname(_INSTALL_ID_FILE) or ".", exist_ok=True)
    # 0600 so other accounts on the same machine can't read it. We're not
    # treating it as a secret, but no reason to be sloppy.
    fd = os.open(_INSTALL_ID_FILE, os.O_CREAT | os.O_WRONLY | os.O_TRUNC, 0o600)
    try:
        os.write(fd, fresh.encode("utf-8"))
    finally:
        os.close(fd)
    _cached = fresh
    return _cached


def _looks_like_uuid(s: str) -> bool:
    if len(s) != 36:
        return False
    try:
        uuid.UUID(s)
        return True
    except ValueError:
        return False
