import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarRoyalVizierI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Royal Vizier",
    text: [
      {
        title: "I DON'T TRUST HIM, SIRE",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Großwesir",
    text: [
      {
        title: "Ich trau ihm nicht, Hoheit",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Grand Vizir",
    text: [
      {
        title: "Il ne m'inspire pas confiance",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier les personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Royal Vizier",
    text: [
      {
        title: "I Don't Trust Him, Sire",
        description:
          "During your turn, this character gains <Evasive>. (They can challenge characters with Evasive.)",
      },
    ],
  },
  es: {
    name: "Jafar",
    version: "Visir real",
    text: [
      {
        title: "NO CONFÍO EN ÉL, SEÑOR",
        description:
          "Durante tu turno, este personaje gana Evasivo. (Pueden desafiar a los personajes con Evasivo).",
      },
    ],
  },
};
