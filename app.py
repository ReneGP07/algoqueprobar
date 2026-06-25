"""
Servidor local simple para revisar el prototipo APEX AI OPS.
No requiere Flask ni dependencias externas.

Uso:
    python app.py

Luego abrir:
    http://localhost:8000

Nota:
    GitHub Pages solo ejecuta HTML/CSS/JavaScript. Este archivo Python es
    únicamente para probar localmente antes de subir el proyecto.
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser
import os

PORT = int(os.environ.get("PORT", "8000"))
ROOT = Path(__file__).resolve().parent


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        print("[APEX AI OPS]", format % args)


def main():
    server = ThreadingHTTPServer(("", PORT), AppHandler)
    url = f"http://localhost:{PORT}"
    print(f"Servidor iniciado en {url}")
    print("Presiona Ctrl+C para detenerlo.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
