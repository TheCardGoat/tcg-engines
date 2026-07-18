import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinHeroicOutlawEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Heroic Outlaw",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "DARING EXPLOIT",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      },
    ],
  },
  de: {
    name: "Aladdin",
    version: "Heldenhafter Bandit",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Aladdin-Charaktere auszuspielen.)",
      },
      {
        title: "Dreiste Heldentat",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden und alle gegnerischen Mitspielenden verlieren je 2.",
      },
    ],
  },
  fr: {
    name: "ALADDIN",
    version: "Hors-la-loi héroïque",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Aladdin.)",
      },
      {
        title: "EXPLOIT AUDACIEUX",
        description:
          "Lorsque ce personnage en bannit un autre via un défi durant votre tour, vous gagnez 2 éclats de Lore et chaque adversaire en perd 2.",
      },
    ],
  },
  it: {
    name: "Aladdin",
    version: "Heroic Outlaw",
    text: [
      {
        title:
          "<Shift> 5 (You may pay 5 {I} to play this on top of one of your characters named Aladdin.)",
      },
      {
        title: "Daring Exploit",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      },
    ],
  },
  es: {
    name: "Aladino",
    version: "Forajido heroico",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "EXPLOTACIÓN ATREVIDA",
        description:
          "Durante tu turno, cada vez que este personaje destierra a otro personaje en un desafío, ganas 2 conocimientos y cada oponente pierde 2 conocimientos.",
      },
    ],
  },
};
