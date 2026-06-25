# APEX AI OPS demo estable

Demo visual estática para explicar una interfaz industrial de IA con dos módulos:

1. Chatbot para problem solving de mantenimiento.
2. Balanceo de líneas usando sistema de visión e IA.

Esta versión está hecha para no batallar con rutas de CSS/JS: cada archivo HTML trae su propio CSS y JavaScript embebido. Por eso puede abrirse directamente o subirse a GitHub Pages sin depender de carpetas `assets`.

## Cómo probar local

Opción rápida: abre `index.html` con doble clic.

Opción recomendada:

```bash
python app.py
```

Luego entra a:

```text
http://localhost:8000
```

## GitHub Pages

Sube todos los archivos a tu repositorio y activa GitHub Pages desde:

Settings > Pages > Deploy from branch > main > root

## Nota técnica

No conecta cámaras, sensores, PLC, base de datos ni modelos de IA. Es un prototipo visual para explicar flujo, páginas y operación simulada.
