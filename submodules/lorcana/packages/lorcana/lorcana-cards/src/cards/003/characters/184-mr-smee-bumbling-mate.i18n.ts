import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrSmeeBumblingMateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mr. Smee",
    version: "Bumbling Mate",
    text: [
      {
        title: "OH DEAR, DEAR, DEAR",
        description:
          "At the end of your turn, if this character is exerted and you don't have a Captain character in play, deal 1 damage to this character.",
      },
    ],
  },
  de: {
    name: "Herr Smee",
    version: "Stümperhafter Offizier",
    text: [
      {
        title: "OJE, KÄPT'N",
        description:
          "Am Ende deines Zuges, wenn dieser Charakter erschöpft ist und du keinen Kapitän oder keine Kapitänin im Spiel hast, füge diesem Charakter 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Monsieur Mouche",
    version: "Matelos empoté",
    text: [
      {
        title: "OH LA LA LA LA À",
        description:
          "la fin de votre tour, si ce personnage est épuisé et que vous n'avez aucun personnage Capitaine en jeu, infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Spugna",
    version: "Goffo Nostromo",
    text: [
      {
        title: "OH CARO, CARO CAPITAN UNCINO",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato e non hai un personaggio Capitano in gioco, infliggi 1 danno a questo personaggio.",
      },
    ],
  },
};
