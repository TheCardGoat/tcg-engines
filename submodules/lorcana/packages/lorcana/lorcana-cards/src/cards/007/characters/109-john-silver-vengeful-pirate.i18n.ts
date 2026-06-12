import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverVengefulPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Vengeful Pirate",
    text: [
      {
        title: "DRAWN TO A FIGHT",
        description:
          "If an opposing character took damage this turn, you pay 2 {I} less to play this character.",
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
        title: "ZUM KAMPF HINGEZOGEN",
        description:
          "Falls ein gegnerischer Charakter in diesem Zug Schaden erhalten hat, zahlst du 2 weniger, um diesen Charakter auszuspielen. Robust +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "ICH BIN NICHT WEICH GEWORDEN!",
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
        title: "ATTIRÉ PAR LE COMBAT",
        description:
          "Jouer ce personnage vous coûte 2 de moins si un personnage adverse a subi au moins un dommage ce tour-ci. Résistance +1 CROIS SURTOUT PAS QUE J'ME DÉGONFLE! Chaque fois que vous jouez une action qui n'est pas une chanson, vous pouvez choisir un personnage et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Pirata Vendicativo",
    text: [
      {
        title: "ATTRATTO DALLE ZUFFE",
        description:
          "Se un personaggio avversario è stato danneggiato in questo turno, paga 2 in meno per giocare questo personaggio. Resistere +1 NON MI SONO RAMMOLLITO Ogni volta che giochi un'azione che non è una canzone, puoi infliggere 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
