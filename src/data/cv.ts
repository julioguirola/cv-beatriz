/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DATOS DEL CV
 * ─────────────────────────────────────────────────────────────────────────────
 * Todo el contenido editable de la página vive en este archivo.
 * Cambia aquí sin tocar los componentes: el layout, el JSON-LD y los
 * componentes se alimentan de estos datos.
 */

/** Nivel de dominio en escala 1–5. */
export type Level = 1 | 2 | 3 | 4 | 5;

export interface ContactData {
  /** Número visible (formato de visualización). */
  phone: string;
  /** Enlace tel: (sin espacios ni guiones). */
  phoneHref: string;
  /** Enlace de WhatsApp (wa.me). */
  whatsappUrl: string;
  email: string;
  /** Texto visible de la ubicación. */
  location: string;
  /** Localidad estructurada (JSON-LD, schema.org). */
  addressLocality: string;
  /** País estructurado (JSON-LD, schema.org). */
  addressCountry: string;
}

export interface LanguageData {
  name: string;
  /** Etiqueta legible del nivel (se muestra junto al idioma). */
  levelLabel: string;
  /** Nivel en escala 1–5 (rellena los puntos del indicador). */
  level: Level;
}

export interface SoftwareData {
  name: string;
  /** Clave del SVG monocromo en `src/assets/logos/` (sin extensión). Si no existe, se muestra un monograma con las iniciales. */
  logo: string;
  /** Iniciales del monograma de reserva. */
  initials: string;
  /** Nivel de dominio en escala 1–5. */
  level: Level;
}

export interface TimelineEntryData {
  /** Cargo o título obtenido. */
  title: string;
  /** Empresa o institución (opcional). */
  org?: string;
  /** Periodo visible, p. ej. "2025 – 2026" (opcional). */
  period?: string;
  /** Marca el hito como actual (punto relleno de acento). */
  current?: boolean;
}

export interface CvData {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  contact: ContactData;
  languages: LanguageData[];
  software: SoftwareData[];
  softSkills: string[];
  hardSkills: string[];
  experience: TimelineEntryData[];
  education: TimelineEntryData[];
}

export const cv = {
  name: "Beatriz Yuliet Guirola Alvarado",
  firstName: "Beatriz Yuliet",
  lastName: "Guirola Alvarado",
  role: "Arquitecta y Urbanista",

  contact: {
    phone: "+53 55884113",
    phoneHref: "tel:+5355884113",
    whatsappUrl: "https://wa.me/5355884113",
    email: "beatrizyulietguirola@gmail.com",
    location: "Ciego de Ávila, Cuba",
    addressLocality: "Ciego de Ávila",
    addressCountry: "Cuba",
  },

  languages: [
    { name: "Español", levelLabel: "Nativo", level: 5 },
    { name: "Inglés", levelLabel: "Intermedio", level: 3 },
  ],

  // AJUSTAR niveles reales (escala 1–5)
  software: [
    { name: "AutoCAD", logo: "autocad", initials: "Ac", level: 5 },
    { name: "Revit", logo: "revit", initials: "Rv", level: 4 },
    { name: "SketchUp", logo: "sketchup", initials: "Sk", level: 4 },
    { name: "Photoshop", logo: "photoshop", initials: "Ps", level: 3 },
    { name: "Lumion", logo: "lumion", initials: "Lu", level: 3 },
  ],

  softSkills: ["Trabajo en equipo", "Compromiso", "Organización", "Disponibilidad"],

  hardSkills: [
    "Diseño arquitectónico",
    "Diseño interior",
    "Modelado 3D",
    "Dibujo técnico",
    "Renderizado",
    "Diseño gráfico",
  ],

  experience: [
    {
      title: "Especialista de Programa e Ingeniería",
      org: "Empresa de Diseño e Ingeniería DIMARQ",
      period: "Actual",
      current: true,
    },
    {
      title: "Arquitecta / Diseñadora Freelancer",
      period: "2025 – 2026",
    },
  ],

  education: [
    {
      title: "Arquitectura y Urbanismo",
      org: "Universidad de Camagüey Ignacio Agramonte Loynaz",
    },
  ],
} satisfies CvData;
