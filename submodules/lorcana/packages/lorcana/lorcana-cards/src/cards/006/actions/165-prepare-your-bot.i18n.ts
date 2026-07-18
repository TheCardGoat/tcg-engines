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
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Mache einen Gegenstand deiner Wahl bereit.",
      },
      {
        title:
          "• Mache einen Roboter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Prépare ton robot",
    text: [
      {
        title: "Choisissez entre:",
      },
      {
        title: "• Choississez un objet et redressez-le.",
      },
      {
        title:
          "• Choississez un personnage Robot et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Prepara il tuo Robot",
    text: [
      {
        title: "Scegli uno:",
      },
      {
        title: "• Prepara un oggetto a tua scelta.",
      },
      {
        title:
          "• Prepara un personaggio Robot a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Prepara tu robot",
    text: [
      {
        title: "Elige uno:",
      },
      {
        title: "*Artículo elegido listo.",
      },
      {
        title:
          "* Personaje robot elegido listo. No pueden realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
