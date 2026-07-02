# La Forja · Potencia E y yo

Experiencia web cinematográfica del **Plan Celestial** de Juan Esteban Deossa,
construida como herramienta personal y de pitch para la entrevista de
**Potencia E** (Ingeniería Física – EAFIT).

Es un **sistema estelar** interactivo: la estrella central (Juan Esteban +
Potencia E) es el origen, y al iniciar el viaje las demás estrellas emergen
desde el centro y se posicionan en el espacio. Cada estrella es una etapa de la
visión, explorable de forma guiada (para el pitch) o libre.

## Concepto

| Estrella | Representa |
|----------|-----------|
| **La Forja** (central) | Juan Esteban + Potencia E · origen y catalizador |
| **El Ahora** | Potencia E, inicio de Ingeniería Física y disciplina diaria |
| **Los Motores** | Context y Coffi como prueba de ejecución |
| **Los Fundamentos** | GEMA, Cohetería y la física fundamental |
| **Soberanía** | Energía limpia y defensa para Sapzurro |
| **El Legado** | Colombia como potencia Deep Tech y espacial |

## Flujo

1. **Apertura (Hero):** solo la estrella central, con título *La Forja* y la
   introducción. Botón **Iniciar el Viaje**.
2. **Expansión:** las estrellas nacen y emergen desde el centro.
3. **Exploración:**
   - **Seguir el Camino** — recorrido guiado, ideal para el pitch.
   - **Toca una estrella** — exploración libre con viaje de cámara.
   - Navegador lateral de estrellas (desktop) y paneles de contenido.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Three.js** + **React Three Fiber** + **drei** (sistema estelar y cámara)
- **Framer Motion** (interfaz y paneles)
- **Zustand** (estado de fases y navegación)
- Tipografías: **Fraunces** (display) + **Manrope** (cuerpo)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm start        # servir build
```

## Estructura

```
src/
  app/
    layout.tsx        # fuentes + metadata
    page.tsx          # orquesta fases y overlays
    globals.css       # tema cósmico, grain, vignette
  components/
    three/
      StarField.tsx   # Canvas R3F
      Scene.tsx       # escena, nebulosas, rig de cámara, expansión
      Star.tsx        # estrella (núcleo + halos + label)
      textures.ts     # texturas de brillo y nebulosa
    overlay/
      Hero.tsx        # portada
      Hud.tsx         # marca, navegador lateral, CTA
      StarPanel.tsx   # panel de contenido + navegación del recorrido
  lib/
    stars.ts          # contenido de las 6 estrellas
    store.ts          # estado (zustand)
docs/                 # documentos fuente de la visión y el pitch
```

El contenido proviene de los documentos en `docs/`
(`Vision_Completa_EAFIT_PotenciaE_JuanEsteban.md`,
`Pitch_PotenciaE_90segundos_JuanEsteban.md`,
`Plan_Experiencia_Web_La_Forja.md`).
