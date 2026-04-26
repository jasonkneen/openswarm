"""Stdio MCP shim that forwards Discord tool calls to the OpenSwarm cloud.

Run as:  python -m backend.apps.discord_mcp_shim
"""
from backend.apps.discord_mcp_shim.server import main

if __name__ == "__main__":
    main()
