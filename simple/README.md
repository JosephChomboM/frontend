# WF Scoring VI Configurator

Una aplicación para configurar y ejecutar pruebas de scoring en diferentes módulos.

## Características

- Configuración de proyectos con información general
- Gestión de troncales y segmentos
- Selección de módulos y pruebas a ejecutar
- Secuencia de configuración optimizada:
  1. Activar segmentos mediante toggle switch
  2. Configurar datos de segmentos (variable segmentadora y cantidad)
  3. Seleccionar módulos a ejecutar
  4. Elegir dónde ejecutar los módulos (universo/segmento)
- Exportación de configuración a formato JSON
- Generación de código SAS

## Requisitos previos

Para desarrollar y compilar la aplicación:

- Python 3.6 o superior
- PyInstaller (`pip install pyinstaller`)

Para ejecutar la aplicación compilada:

- No se requiere ninguna dependencia adicional

## Cómo compilar la aplicación

1. Asegúrate de tener Python y PyInstaller instalados
2. Ejecuta el script `create_exe.bat`
3. El ejecutable se creará en la carpeta `dist`

## Estructura del proyecto

```
simple/
├── app.js                # Aplicación principal
├── components/          # Componentes de la interfaz
│   ├── header.js        # Encabezado y barra de navegación
│   ├── config-form.js   # Formulario de configuración general
│   ├── structure-panel.js # Panel de estructura de troncales
│   ├── module-selector.js # Selector de módulos y pruebas
│   ├── toast.js         # Componente de notificaciones
│   └── modal.js         # Componentes de ventanas modales
├── index.html           # Página principal
├── server.py            # Servidor web Python
├── create_exe.bat       # Script para crear el ejecutable
└── favicon.ico          # Icono de la aplicación
```

## Modo de uso

1. Ejecuta la aplicación (WF_Scoring_VI_Configurator.exe)
2. Completa la información de configuración general
3. Agrega troncales usando el botón en la barra superior
4. Selecciona un troncal para configurarlo
5. Habilita segmentos si es necesario usando el toggle switch
6. Selecciona los módulos y pruebas a ejecutar
7. Decide si ejecutar en universo, segmento o en todo el troncal
8. Presiona "Ejecutar Pruebas" para iniciar la ejecución

## Notas

Esta aplicación no requiere Node.js ni npm para ejecutarse, ya que está construida con JavaScript vanilla y un servidor Python que se convierte en un ejecutable independiente usando PyInstaller.
