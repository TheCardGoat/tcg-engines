import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseSnowboardAceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Snowboard Ace",
    text: [
      {
        title: "SLIPPERY SLOPE",
        description:
          "When you play this character and when he leaves play, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Snowboard-Ass",
    text: [
      {
        title: "RUTSCHIGE PISTE",
        description:
          "Wenn du diesen Charakter ausspielst und wenn er das Spiel verlässt, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "As du snowboard",
    text: [
      {
        title: "PENTE GLISSANTE",
        description:
          "Lorsque vous jouez ce personnage et quand il quitte la zone de jeu, chaque adversaire défausse une carte.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Asso dello Snowboard",
    text: [
      {
        title: "PISTA SCIVOLOSA",
        description:
          "Quando giochi questo personaggio e quando lascia il gioco, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
