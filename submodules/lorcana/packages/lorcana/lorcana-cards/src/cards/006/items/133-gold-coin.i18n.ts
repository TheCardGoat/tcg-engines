import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goldCoinI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gold Coin",
    text: [
      {
        title: "GLITTERING ACCESS",
        description:
          "{E}, 1 {I}, Banish this item — Ready chosen character of yours. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Goldmünze",
    text: [
      {
        title: "GLITZERNDER EINSTIEG, 1,",
        description:
          "Verbanne diesen Gegenstand — Wähle einen deiner Charaktere und mache ihn bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Pièce d’or",
    text: [
      {
        title: "ACCÈS ÉTINCELANT,",
        description:
          "1, bannissez cet objet — Choisissez l'un de vos personnages et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Moneta d'Oro",
    text: [
      {
        title: "ACCESSO SCINTILLANTE, 1,",
        description:
          "esilia questo oggetto — Prepara un tuo personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
