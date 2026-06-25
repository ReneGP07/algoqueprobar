from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

PORT = 8000
ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

if __name__ == '__main__':
    url = f'http://localhost:{PORT}'
    print(f'Servidor local: {url}')
    print('Para detenerlo: Ctrl + C')
    webbrowser.open(url)
    ThreadingHTTPServer(('localhost', PORT), Handler).serve_forever()
