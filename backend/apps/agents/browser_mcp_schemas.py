"""Tool schema definitions for the browser MCP server."""

TAB_ID_PROP = {
    "type": "string",
    "description": "Optional tab ID within the browser card. If omitted, targets the active tab.",
}

TOOLS = [
    {
        "name": "BrowserScreenshot",
        "description": (
            "Capture a screenshot of the browser page. Returns the screenshot as a "
            "base64-encoded PNG image. Use this to see what is currently displayed."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID to capture. Use the ID from the selected browser card context.",
                },
                "tab_id": TAB_ID_PROP,
            },
            "required": ["browser_id"],
        },
    },
    {
        "name": "BrowserGetText",
        "description": (
            "Get the visible text content of the browser page. Returns the page's "
            "innerText (up to 15000 characters)."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
            },
            "required": ["browser_id"],
        },
    },
    {
        "name": "BrowserNavigate",
        "description": "Navigate the browser to a URL.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "url": {
                    "type": "string",
                    "description": "The URL to navigate to.",
                },
            },
            "required": ["browser_id", "url"],
        },
    },
    {
        "name": "BrowserClick",
        "description": (
            "Click an element in the browser page identified by a CSS selector."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "selector": {
                    "type": "string",
                    "description": "CSS selector of the element to click.",
                },
            },
            "required": ["browser_id", "selector"],
        },
    },
    {
        "name": "BrowserType",
        "description": (
            "Type text into an input element in the browser page. Clears the "
            "existing value first, then types the new text."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "selector": {
                    "type": "string",
                    "description": "CSS selector of the input element.",
                },
                "text": {
                    "type": "string",
                    "description": "The text to type.",
                },
            },
            "required": ["browser_id", "selector", "text"],
        },
    },
    {
        "name": "BrowserEvaluate",
        "description": (
            "Evaluate a JavaScript expression in the browser page and return the result. "
            "The expression is run via executeJavaScript on the webview."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "expression": {
                    "type": "string",
                    "description": "JavaScript expression to evaluate.",
                },
            },
            "required": ["browser_id", "expression"],
        },
    },
    {
        "name": "BrowserGetElements",
        "description": (
            "Get a list of interactive elements on the page with their CSS selectors. "
            "Returns clickable elements, inputs, links, and buttons with selector paths "
            "you can use with BrowserClick and BrowserType. Call this BEFORE attempting "
            "to click or type so you know which selectors are valid."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "selector": {
                    "type": "string",
                    "description": (
                        "Optional CSS selector to scope the search "
                        "(e.g. 'form', '#main'). Defaults to 'body'."
                    ),
                },
            },
            "required": ["browser_id"],
        },
    },
    {
        "name": "BrowserScroll",
        "description": (
            "Scroll the page up or down. Automatically finds the correct scrollable "
            "container (works on SPAs like Notion, Gmail, etc. that use nested scroll "
            "containers instead of window-level scrolling). Returns scroll position info "
            "including whether top/bottom has been reached."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "direction": {
                    "type": "string",
                    "enum": ["up", "down"],
                    "description": "Scroll direction. Defaults to 'down'.",
                },
                "amount": {
                    "type": "number",
                    "description": "Pixels to scroll. Defaults to 500.",
                },
            },
            "required": ["browser_id"],
        },
    },
    {
        "name": "BrowserWait",
        "description": (
            "Wait for a specified duration. Useful after navigation or actions that "
            "trigger page loads, animations, or async content rendering. "
            "Min 100ms, max 10000ms."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "browser_id": {
                    "type": "string",
                    "description": "The browser card ID.",
                },
                "tab_id": TAB_ID_PROP,
                "milliseconds": {
                    "type": "number",
                    "description": "Duration to wait in milliseconds. Defaults to 1000.",
                },
            },
            "required": ["browser_id"],
        },
    },
]
