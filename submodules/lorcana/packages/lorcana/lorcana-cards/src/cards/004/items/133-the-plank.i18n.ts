import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thePlankI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Plank",
    text: [
      {
        title: "WALK! 2",
        description: "{I}, Banish this item — Choose one:",
      },
      {
        title: "• Banish chosen Hero character.",
      },
      {
        title: "• Ready chosen Villain character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Die Planke",
    text: [
      {
        title: "Los!",
        description: "2 {I}, Verbanne diesen Gegenstand — Wähle eine Möglickeit aus:",
      },
      {
        title: "• Verbanne einen Held oder eine Heldin deiner Wahl.",
      },
      {
        title:
          "• Mache eine Schurkin oder einen Schurken deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "La Planche",
    text: [
      {
        title: "Avance!",
        description: "2 {I}, Bannissez cet objet — Choisissez entre:",
      },
      {
        title: "• Choisissez un personnage Héros et bannissez-le.",
      },
      {
        title:
          "• Choisissez un personnage Méchant et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "L'Asse",
    text: [
      {
        title: "Cammina!",
        description: "2 {I}, esilia questo oggetto — Scegli uno:",
      },
      {
        title: "• Esilia un personaggio Eroe a tua scelta.",
      },
      {
        title:
          "• Prepara un personaggio Cattivo a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "El tablón",
    text: [
      {
        title: "¡CAMINAR! 2",
        description: "{I}, desterrar este objeto — Elige uno:",
      },
      {
        title: "• Destierra al personaje héroe elegido.",
      },
      {
        title:
          "• Personaje villano elegido listo. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
