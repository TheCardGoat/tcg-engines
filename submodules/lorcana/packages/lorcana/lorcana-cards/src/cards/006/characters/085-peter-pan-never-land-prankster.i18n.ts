import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanNeverLandPranksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Never Land Prankster",
    text: [
      {
        title: "LOOK INNOCENT",
        description: "This character enters play exerted.",
      },
      {
        title: "CAN'T TAKE",
        description:
          "A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Spaßvogel von Nimmerland",
    text: [
      {
        title: "Sieh harmlos aus",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
      {
        title: "Verstehst du keinen Spaß?",
        description:
          "Solange dieser Charakter erschöpft ist, können gegnerische Mitspielende keine Legenden sammeln, außer einer ihrer Charaktere hat in diesem Zug herausgefordert.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Farceur du Pays Imaginaire",
    text: [
      {
        title: "L'air innocent",
        description: "Ce personnage arrive en jeu épuisé.",
      },
      {
        title: "C'est juste une blague",
        description:
          "Tant que ce personnage est épuisé, les adversaires ne peuvent pas gagner d'éclats de Lore à moins que l'un de leurs personnages ait défié ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Burlone dell'Isola Che Non C'è",
    text: [
      {
        title: "Aspetto Innocente",
        description: "Questo personaggio entra in gioco impegnato.",
      },
      {
        title: "Non Sai Stare agli Scherzi?",
        description:
          "Mentre questo personaggio è impegnato, ogni giocatore avversario non può ottenere leggenda a meno che uno dei suoi personaggi non abbia sfidato in questo turno.",
      },
    ],
  },
};
