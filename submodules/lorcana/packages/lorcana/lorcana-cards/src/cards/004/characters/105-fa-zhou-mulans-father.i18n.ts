import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const faZhouMulansFatherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fa Zhou",
    version: "Mulan's Father",
    text: [
      {
        title: "WAR INJURY",
        description: "This character can't challenge.",
      },
      {
        title: "HEAD OF THE HOUSEHOLD",
        description:
          "{E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Fa Zhou",
    version: "Mulans Vater",
    text: [
      {
        title: "KRIEGSVERLETZUNGEN",
        description: "Dieser Charakter kann nicht herausfordern.",
      },
      {
        title: "FAMILIENOBERHAUPT",
        description:
          "— Mache einen Mulan-Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Fa Zhou",
    version: "Père de Mulan",
    text: [
      {
        title: "BLESSURE DE GUERRE",
        description: "Ce personnage ne peut pas défier.",
      },
      {
        title: "CHEF DE FAMILLE",
        description:
          "— Choisissez un personnage Mulan et redressez-le. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Fa Zhou",
    version: "Padre di Mulan",
    text: [
      {
        title: "FERITA DI GUERRA",
        description: "Questo personaggio non può sfidare.",
      },
      {
        title: "CAPOFAMIGLIA",
        description:
          "— Prepara un personaggio a tua scelta chiamato Mulan. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
