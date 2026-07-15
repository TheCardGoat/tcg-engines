import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sulleyBooScareBuddiesEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sulley & Boo",
    version: "Scare Buddies",
    text: [
      {
        title: "Combo Shift 4 {I}",
      },
      {
        title: "THE POWER OF FRIENDSHIP",
        description:
          "When this character is banished, if any of the cards that were under them are character cards, you may play those characters from your discard for free.",
      },
    ],
  },
  de: {
    name: "Sulley & Buh",
    version: "Erschrecker-Freunde",
    text: [
      {
        title:
          "<Kombo-Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Sulley oder Buh oder auf beide zusammen auszuspielen.)",
      },
      {
        title: "Die Macht der Freundschaft",
        description:
          "Wenn dieser Charakter verbannt wird, falls unter diesem Charakter andere Charakterkarten lagen, darfst du jene von deinem Ablagestapel kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Sulli & Bouh",
    version: "Amis de terreur",
    text: [
      {
        title: "<Alter Combo> 4 {I}",
      },
      {
        title: "Le pouvoir de l'amitié",
        description:
          "Lorsque ce personnage est banni, si une ou plusieurs cartes sous lui sont des cartes Personnage, vous pouvez jouer gratuitement ces personnages-là depuis votre défausse.",
      },
    ],
  },
  it: {
    name: "Sulley e Boo",
    version: "Amici dello Spavento",
    text: [
      {
        title:
          "<Trasformazione Combo> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Sulley, uno chiamato Boo, o uno di entrambi.)",
      },
      {
        title: "Il Potere dell'Amicizia",
        description:
          "Quando questo personaggio viene esiliato, se tra le carte sotto a esso ci sono delle carte personaggio, puoi giocare quei personaggi dai tuoi scarti, gratis.",
      },
    ],
  },
};
