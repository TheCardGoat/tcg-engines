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
        title: "ES WIRD ZEIT!",
        description:
          "Für jede Aktionskarte in deinem Ablagestapel zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "CHAOTISCHE KOLLISION",
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
        title: "IL ÉTAIT TEMPS!",
        description:
          "Jouer ce personnage vous coûte 1 de moins pour chaque carte Action dans votre défausse.",
      },
      {
        title: "COLLISION CHAOTIQUE",
        description: "Lorsque vous jouez ce personnage, chaque adversaire perd 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Pupazzo di Neve in Azione",
    text: [
      {
        title: "ERA ORA!",
        description:
          "Per ogni carta azione nei tuoi scarti, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "COLLISIONE CAOTICA",
        description: "Quando giochi questo personaggio, ogni avversario perde 2 leggenda.",
      },
    ],
  },
};
