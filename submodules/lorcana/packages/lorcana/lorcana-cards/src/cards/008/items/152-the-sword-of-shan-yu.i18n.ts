import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSwordOfShanyuI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sword of Shan-Yu",
    text: [
      {
        title: "WORTHY WEAPON",
        description:
          "{E}, {E} one of your characters — Ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Das Schwert des Shan-Yu",
    text: [
      {
        title: "WÜRDIGE WAFFE,",
        description:
          "einen deiner Charaktere — Mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "L’épée de Shan-Yu",
    text: [
      {
        title: "UNE ARME DIGNE DE CE NOM,",
        description:
          "l'un de vos personnages — Choisissez un personnage et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "La Spada di Shan-Yu",
    text: [
      {
        title: "ARMA DEGNA,",
        description:
          "uno dei tuoi personaggi — Prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
