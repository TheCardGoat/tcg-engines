import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverVengefulPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Vengeful Pirate",
    text: [
      {
        title: "DRAWN TO",
        description:
          "A FIGHT If an opposing character was damaged this turn, you pay 2 {I} less to play this character.",
      },
      {
        title: "Resist +1",
      },
      {
        title: "I AIN'T GONE SOFT!",
        description:
          "Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Rachsüchtiger Pirat",
    text: [
      {
        title: "Zum Kampf hingezogen",
        description:
          "Falls ein gegnerischer Charakter in diesem Zug Schaden erhalten hat, zahlst du 2 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Ich bin nicht weich geworden!",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, die kein Lied ist, darfst du einem Charakter deiner Wahl 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Pirate revanchard",
    text: [
      {
        title: "Attiré par le combat",
        description:
          "Jouer ce personnage vous coûte 2 {I} de moins si un personnage adverse a subi au moins un dommage ce tour-ci.",
      },
      {
        title: "<Résistance> +1",
      },
      {
        title: "Crois surtout pas que j'me dégonfle!",
        description:
          "Chaque fois que vous jouez une action qui n'est pas une chanson, vous pouvez choisir un personnage et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Pirata Vendicativo",
    text: [
      {
        title: "Attratto dalle Zuffe",
        description:
          "Se un personaggio avversario ha subito danno in questo turno, paga 2 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Resistere> +1",
      },
      {
        title: "Non Mi Sono Rammollito",
        description:
          "Ogni volta che giochi un'azione che non è una canzone, puoi infliggere 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
