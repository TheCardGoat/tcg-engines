import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarViciousCheaterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Vicious Cheater",
    text: [
      {
        title: "Rush",
      },
      {
        title: "DADDY ISN'T HERE TO SAVE YOU",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Übler Betrüger",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Papi kann dich diesmal nicht retten",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du ihn bereit machen. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Tricheur vicieux",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Papa n'est pas là pour te sauver",
        description:
          "Lorsque ce personnage en bannit un autre via un défi durant votre tour, vous pouvez le redresser. Il ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Vicious Cheater",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "Daddy Isn't Here to Save You",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.",
      },
    ],
  },
};
