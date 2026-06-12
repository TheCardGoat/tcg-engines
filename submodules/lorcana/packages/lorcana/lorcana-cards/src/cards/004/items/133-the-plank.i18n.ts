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
        title: "LOS! 2,",
        description:
          "Verbanne diesen Gegenstand — Wähle eine Möglickeit aus: • Verbanne einen Held oder eine Heldin deiner Wahl. • Mache eine Schurkin oder einen Schurken deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "La Planche",
    text: [
      {
        title: "AVANCE! 2,",
        description:
          "Bannissez cet objet — Choisissez entre: • Choisissez un personnage Héros et bannissez-le. • Choisissez un personnage Méchant et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "L'Asse",
    text: [
      {
        title: "CAMMINA! 2,",
        description:
          "esilia questo oggetto — Scegli uno: • Esilia un personaggio Eroe a tua scelta. • Prepara un personaggio Cattivo a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
