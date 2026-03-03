from __future__ import annotations

import argparse
import http.server
import socketserver
from pathlib import Path

APP_DIR = Path(__file__).parent / "app"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run a TikTok-style social media demo app locally."
    )
    parser.add_argument("--host", default="0.0.0.0", help="Host interface (default: 0.0.0.0)")
    parser.add_argument("--port", default=8000, type=int, help="Server port (default: 8000)")
    return parser.parse_args()


def run_server(host: str, port: int) -> None:
    if not APP_DIR.exists():
        raise FileNotFoundError(f"App directory not found: {APP_DIR}")

    handler = lambda *args, **kwargs: http.server.SimpleHTTPRequestHandler(  # noqa: E731
        *args, directory=str(APP_DIR), **kwargs
    )

    with socketserver.ThreadingTCPServer((host, port), handler) as httpd:
        print(f"TikTok-style app running at http://{host}:{port}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    args = parse_args()
    run_server(args.host, args.port)
