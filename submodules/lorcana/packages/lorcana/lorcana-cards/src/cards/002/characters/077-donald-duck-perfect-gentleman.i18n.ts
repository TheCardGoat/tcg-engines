import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckPerfectGentlemanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Perfect Gentleman",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "ALLOW ME",
        description: "At the start of your turn, each player may draw a card.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Perfekter Gentleman",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Donald-Duck-Charaktere auszuspielen.)",
      },
      {
        title: "Gestatten?",
        description:
          "Jedes Mal zu Beginn deines Zuges dürfen alle Mitspielenden (auch du) je 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Parfait gentleman",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Donald.)",
      },
      {
        title: "Permettez-moi",
        description: "Au début de chacun de vos tours, chaque joueur peut piocher une carte.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Perfect Gentleman",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Donald Duck.)",
      },
      {
        title: "Allow Me",
        description: "At the start of your turn, each player may draw a card.",
      },
    ],
  },
};
