# MacBook Pro M1 Max — Interactive Landing Page

Una experiencia web interactiva inspirada en el diseño de Apple, con animación fluida en `<canvas>` controlada por el desplazamiento del usuario (scrollytelling), transiciones tipográficas, contadores numéricos dinámicos y diseño responsivo.

Construida con Vanilla JavaScript, sin librerías externas ni dependencias pesadas.

---

## Características principales

- **Animación Canvas Scrollytelling:** Secuencia fluida de 180 fotogramas WebP sincronizados con la posición del scroll.
- **Preloader interactivo:** Barra de carga con porcentaje en tiempo real para precargar las imágenes antes de iniciar la experiencia.
- **Contadores numéricos animados:** Estadísticas de rendimiento (RAM unificada, almacenamiento, núcleos de GPU y CPU) que se incrementan automáticamente al llegar a su sección.
- **Marquees dinámicos:** Cintas de texto continuo con especificaciones técnicas destacadas.
- **Estilo visual Apple:** Modo oscuro, tipografía SF Pro / DM Sans, efectos de desenfoque (backdrop-filter) y transiciones suaves.
- **100% Vanilla:** Desarrollado sin frameworks para máxima ligereza y rendimiento.

---

## Tecnologías utilizadas

- **HTML5:** Estructura semántica y elemento `<canvas>`.
- **CSS3:** Flexbox, CSS Grid, variables CSS, animaciones y diseño responsivo.
- **JavaScript (ES6+):** Lógica del canvas, precarga asíncrona de imágenes y cálculo de scroll.
- **WebP:** Formato de imagen ligero y optimizado para la secuencia de fotogramas.

---

## Estructura del proyecto

```text
MacBook/
├── css/
│   └── style.css            # Estilos y diseño responsivo
├── js/
│   └── app.js               # Lógica del scroll, canvas y animaciones
├── frames/
│   ├── frame_0001.webp      # Secuencia de fotogramas (0001 a 0180)
│   └── ...
├── index.html               # Página principal
├── .gitignore               # Archivos excluidos del repositorio
└── README.md                # Documentación del proyecto
```

---

## Autor

Jose Rios / [rmjuasjuas](https://github.com/rmjuasjuas)

---

## Licencia

Este proyecto fue desarrollado con fines educativos y de práctica de desarrollo web front-end. Inspirado en el diseño y presentaciones de producto de Apple Inc.