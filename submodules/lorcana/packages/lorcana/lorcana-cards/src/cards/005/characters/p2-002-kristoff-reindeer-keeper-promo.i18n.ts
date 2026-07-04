import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kristoffReindeerKeeperP2PromoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kristoff",
    version: "Reindeer Keeper",
    text: [
      {
        title: "SONG OF THE HERD",
        description:
          "For each song card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "Bodyguard",
      },
    ],
  },
  de: {
    name: "Kristoff",
    version: "Rentier Hüter",
    text: [
      {
        title: "Gesang der Herde",
        description:
          "Für jede Liedkarte in deinem Ablagestapel, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Kristoff",
    version: "Garde-rennes",
    text: [
      {
        title: "Chant du troupeau",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins par carte Chanson dans votre défausse.",
      },
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'un adversaire défie l'un de vos personnages, il doit, si possible, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Kristoff",
    version: "Custode delle Renne",
    text: [
      {
        title: "Canzone del Branco",
        description:
          "Per ogni carta canzone nei tuoi scarti, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Guardiano>",
      },
    ],
  },
};
