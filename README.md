# 👗 My Virtual Closet

Aplicación web para organizar tu armario, crear outfits y planificar tu vestuario. Es un armario digital personal con catálogo de prendas, creador de outfits, calendario, lista de deseos y estadísticas, todo guardado en tu propio navegador.

🔗 **Demo:** https://dansire.github.io/my-virtual-closet/

## Objetivos

- Practicar React, JavaScript moderno, Git y GitHub con un proyecto completo.
- Construir un producto con diseño cuidado y una arquitectura modular que se pueda ampliar.
- Aplicar un flujo profesional: ramas, commits convencionales, Pull Requests y despliegue automático.

## Capturas de pantalla

> Guarda tus capturas en `docs/screenshots/` con estos nombres y se mostrarán aquí.

| Inicio | Mi armario |
|---|---|
| ![Inicio](docs/screenshots/dashboard.png) | ![Armario](docs/screenshots/wardrobe.png) |

| Creador de outfits | Calendario |
|---|---|
| ![Outfits](docs/screenshots/outfit-builder.png) | ![Calendario](docs/screenshots/calendar.png) |

## Características principales

- **Inicio:** saludo personalizado, resumen del armario, outfit del día (cambia cada día), inspiración y accesos rápidos.
- **Mi armario:** CRUD completo de prendas con foto, búsqueda, filtros combinables (categoría, color, temporada, estilo), orden, vista cuadrícula o lista y favoritos.
- **Fotos persistentes:** las imágenes se comprimen y se guardan en IndexedDB, así que sobreviven a recargas sin agotar localStorage.
- **Creador de outfits:** siete espacios (superior, inferior, vestido, exterior, calzado, bolso, accesorio) con vista previa en vivo.
- **Mis outfits:** galería con detalle, favoritos, duplicado, búsqueda y filtros. Si borras una prenda usada en un outfit, se muestra "Prenda eliminada" sin romper nada.
- **Calendario:** planificador mensual con miniaturas; pide confirmación antes de reemplazar un día ya asignado.
- **Lista de deseos:** prioridad, presupuesto estimado y paso de "comprada" al armario.
- **Estadísticas:** gráficos con Recharts a partir de tus datos reales.
- **Configuración:** modo claro y oscuro, exportar e importar copias de seguridad en JSON (con fotos), restablecer datos y ayuda de uso.
- **Buscador global**, avisos tipo toast, confirmaciones antes de eliminar, accesibilidad con teclado y diseño responsive.

## Tecnologías

React 19, Vite, JavaScript (ES6+), CSS3, React Router (HashRouter), Context API y Hooks, localStorage, IndexedDB (`idb`), Recharts, date-fns, Lucide React, Vitest y React Testing Library.

## Instalación y ejecución local

```bash
git clone https://github.com/dansire/my-virtual-closet.git
cd my-virtual-closet
npm install
npm run dev
```

Abre `http://localhost:5173/my-virtual-closet/` en tu navegador.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación para producción |
| `npm run lint` | Revisión de código con ESLint |
| `npm test` | Pruebas con Vitest |

## Estructura del proyecto

```
src/
├── components/   # common, layout, clothing, outfits, calendar, wishlist, dashboard
├── pages/        # una pantalla por sección
├── context/      # tema, avisos y datos del armario
├── hooks/        # useLocalStorage, useClothing, useOutfits, useWishlist...
├── services/     # lógica de negocio y almacenamiento (sin React)
├── constants/    # categorías, estilos, colores, ocasiones
├── utils/        # fechas y etiquetas
├── styles/       # tokens de diseño y estilos por sección
└── test/         # pruebas
```

La lógica vive en `services/` y los componentes nunca tocan `localStorage` directamente. Los outfits guardan solo los IDs de las prendas, por eso editar una prenda actualiza todos sus outfits.

## Instrucciones de uso

1. En **Agregar prenda** registra tu ropa con foto.
2. En **Crear outfit** combina prendas y guárdalas con nombre, ocasión y estilo.
3. En **Calendario** asigna outfits a los días que quieras.
4. Guarda lo que quieres comprar en **Lista de deseos**.
5. Exporta una copia de seguridad desde **Configuración** cuando quieras.

## Flujo de trabajo

Se usó Git Flow simplificado: `main` estable, `develop` para integrar y una rama `feature/*` por funcionalidad, con Pull Requests hacia `develop` y commits siguiendo Conventional Commits. El despliegue a GitHub Pages es automático al actualizar `main` (`.github/workflows/deploy.yml`).

## Próximas mejoras

- Vista de maniquí con las prendas colocadas sobre una silueta.
- Sincronización en la nube y cuentas de usuario.
- Sugerencias de outfits según el clima.
- Quitar el fondo de las fotos automáticamente.

## Créditos

Desarrollado por Daniela como proyecto de portafolio. Iconos de [Lucide](https://lucide.dev), gráficos con [Recharts](https://recharts.org) y tipografías Cormorant Garamond e Inter de Google Fonts.

## Licencia

MIT