import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesMightyLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Mighty Leader",
    text: [
      {
        title: "EVER VIGILANT",
        description: "This character can't be dealt damage unless he's being challenged.",
      },
      {
        title: "EVER VALIANT",
        description:
          "While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Mächtiger Anführer",
    text: [
      {
        title: "STETS WACHSAM",
        description: "Dieser Charakter erhält keinen Schaden, außer er wird herausgefordert.",
      },
      {
        title: "STETS WACKER",
        description:
          "Solange dieser Charakter erschöpft ist, erhalten deine anderen Helden keinen Schaden, außer sie werden herausgefordert.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Puissant meneur",
    text: [
      {
        title: "TOUJOURS VIGILANT",
        description: "Ce personnage ne peut pas subir de dommages, hormis lorsqu'il est défié.",
      },
      {
        title: "TOUJOURS VAILLANT",
        description:
          "Tant que ce personnage est épuisé, vos autres personnages Héros ne peuvent pas subir de dommages, hormis lorsqu'ils sont défiés.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Potente Leader",
    text: [
      {
        title: "SEMPRE ALL'ERTA",
        description: "Questo personaggio non può subire danni a meno che non venga sfidato.",
      },
      {
        title: "SEMPRE VALOROSO",
        description:
          "Mentre questo personaggio è impegnato, i tuoi altri personaggi Eroe non possono subire danni a meno che non vengano sfidati.",
      },
    ],
  },
};
