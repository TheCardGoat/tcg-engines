import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseMusketeerChampionEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Musketeer Champion",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "DRAMATIC ENTRANCE",
        description:
          "When you play this character, banish chosen opposing character with 5 {S} or more.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Musketier-Champion",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "SPEKTAKULÄRER AUFTRITT",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne einen gegnerischen Charakter deiner Wahl mit 5 oder mehr.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Championne Mousquetaire",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "ENTRÉE THÉATRALE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse avec 5 ou plus et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Paladina dei Moschettieri",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "ENTRATA DRAMMATICA",
        description:
          "Quando giochi questo personaggio, esilia un personaggio avversario a tua scelta con 5 o superiore.",
      },
    ],
  },
};
