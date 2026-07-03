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
        title: "Stets wachsam",
        description:
          "Diesem Charakter kann kein Schaden zugefügt werden, außer er wird herausgefordert.",
      },
      {
        title: "Stets wacker",
        description:
          "Solange dieser Charakter erschöpft ist, kann deinen anderen Helden kein Schaden zugefügt werden, außer sie werden herausgefordert.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Puissant meneur",
    text: [
      {
        title: "Toujours vigilant",
        description: "Ce personnage ne peut pas subir de dommages, hormis lorsqu'il est défié.",
      },
      {
        title: "Toujours vaillant",
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
        title: "Sempre all'Erta",
        description: "Questo personaggio non può subire danni a meno che non venga sfidato.",
      },
      {
        title: "Sempre Valoroso",
        description:
          "Mentre questo personaggio è impegnato, i tuoi altri personaggi Eroe non possono subire danni a meno che non vengano sfidati.",
      },
    ],
  },
};
