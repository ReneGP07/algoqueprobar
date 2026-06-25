# APEX AI OPS - Prototipo visual industrial

Prototipo de interfaz para mostrar cómo funcionaría una plataforma industrial con dos módulos principales:

1. **Chatbot para problem solving de mantenimiento**
2. **Balanceo de líneas usando sistema de visión e IA**

Este proyecto es una demo visual. No conecta cámaras, sensores, bases de datos ni modelos de IA reales. Está pensado para presentar la idea a un cliente, explicar el flujo de trabajo y dejar una base limpia para desarrollo posterior.

## Estructura

```text
apex_ai_ops_demo/
├── index.html              # Dashboard principal
├── operacion.html          # Vista de operación en vivo
├── mantenimiento.html      # Módulo de chatbot de mantenimiento
├── balanceo.html           # Módulo de balanceo de líneas
├── alertas.html            # Consola de alertas
├── historial.html          # Historial operativo
├── reportes.html           # Reportes de turno
├── configuracion.html      # Configuración conceptual
├── app.py                  # Servidor local simple sin dependencias
└── assets/
    ├── css/styles.css      # Estilos principales
    └── js/app.js           # Interacciones visuales y datos mock
```

## Cómo probar localmente

Opción 1, abrir directo:

```bash
abrir index.html en el navegador
```

Opción 2, correr con Python:

```bash
python app.py
```

Después abrir:

```text
http://localhost:8000
```

No se requiere instalar paquetes.

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta.
3. En GitHub entra a `Settings > Pages`.
4. En `Source`, selecciona `Deploy from a branch`.
5. Selecciona la rama `main` y la carpeta `/root`.
6. Guarda los cambios.
7. GitHub generará una URL pública para la demo.

GitHub Pages ejecuta únicamente HTML, CSS y JavaScript. El archivo `app.py` no se ejecutará en GitHub Pages; solo sirve para probar localmente.

## Qué hace cada página

- **Resumen:** muestra el estado general de la operación, KPIs, chatbot, balanceo de línea y alertas.
- **Operación en vivo:** muestra cómo se vería la supervisión de planta en tiempo real.
- **Análisis de línea:** enfocado en estaciones, utilización, cuello de botella y acciones sugeridas.
- **Mantenimiento IA:** enfocado en diagnóstico guiado por chatbot, recursos y acciones recomendadas.
- **Alertas:** muestra prioridades operativas.
- **Historial:** muestra trazabilidad de eventos y órdenes previas.
- **Reportes:** muestra cómo se podría estructurar un cierre de turno.
- **Configuración:** muestra qué elementos se modificarían por cliente.

## Notas para desarrollo real

Para convertir esta demo en una aplicación productiva se recomienda avanzar por etapas:

1. Conectar autenticación y permisos.
2. Conectar datos reales de planta o capturas de prueba.
3. Integrar base de datos para historial, alertas y bitácoras.
4. Integrar el módulo de visión por computadora.
5. Integrar el asistente IA con documentos autorizados y reglas de seguridad.
6. Agregar pruebas, monitoreo y despliegue controlado.

La interfaz está hecha con HTML, CSS y JavaScript puro para que sea estable, ligera y fácil de modificar.
