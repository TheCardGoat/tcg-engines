import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteSteamboatRivalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Steamboat Rival",
    text: [
      {
        title: "SCRAM!",
        description:
          "When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Dampfschiff-Rivale",
    text: [
      {
        title: "VERSCHWINDE!",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren Kater-Karlo-Charakter im Spiel hast, darfst du einen gegnerischen Charakter deiner Wahl verbannen.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Rival du bateau à vapeur",
    text: [
      {
        title: "FICHE LE CAMP!",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage Pat en jeu, vous pouvez choisir un personnage adverse et le bannir.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Rivale del Battello a Vapore",
    text: [
      {
        title: "SPARISCI!",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio chiamato Gambadilegno, puoi esiliare un personaggio avversario a tua scelta.",
      },
    ],
  },
};
