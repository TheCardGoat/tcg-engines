import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const prepareYourBotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prepare Your Bot",
    text: [
      {
        title: "Choose one:",
      },
      {
        title: "* Ready chosen item.",
      },
      {
        title: "* Ready chosen Robot character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Mach deinen Robo bereit",
    text: "Wähle eine Möglichkeit aus: • Mache einen Gegenstand deiner Wahl bereit. • Mache einen Roboter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
  },
  fr: {
    name: "Prépare ton robot",
    text: "Choisissez entre: • Choississez un objet et redressez-le. • Choississez un personnage Robot et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
  },
  it: {
    name: "Prepara il tuo Robot",
    text: "Scegli uno: • Prepara un oggetto a tua scelta. • Prepara un personaggio Robot a tua scelta. Non può andare all'avventura per il resto di questo turno.",
  },
};
