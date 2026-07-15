import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafSnowmanOfActionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Snowman of Action",
    text: [
      {
        title: "ABOUT TIME!",
        description:
          "For each action card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "CHAOTIC COLLISION",
        description: "When you play this character, each opponent loses 2 lore.",
      },
    ],
  },
  de: {
    name: "Olaf",
    version: "Schneemann der Tat",
    text: [
      {
        title: "Es wird Zeit!",
        description:
          "Für jede Aktionskarte in deinem Ablagestapel zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Chaotische Kollision",
        description:
          "Wenn du diesen Charakter ausspielst, verlieren alle gegnerischen Mitspielenden je 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Bonhomme d'action",
    text: [
      {
        title: "Il était temps!",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins pour chaque carte Action dans votre défausse.",
      },
      {
        title: "Collision chaotique",
        description: "Lorsque vous jouez ce personnage, chaque adversaire perd 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Pupazzo di Neve in Azione",
    text: [
      {
        title: "Era Ora!",
        description:
          "Per ogni carta azione nei tuoi scarti, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Collisione Caotica",
        description: "Quando giochi questo personaggio, ogni avversario perde 2 leggenda.",
      },
    ],
  },
};
