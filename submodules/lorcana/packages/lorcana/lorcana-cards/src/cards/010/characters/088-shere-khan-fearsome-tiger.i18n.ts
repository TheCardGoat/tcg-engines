import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shereKhanFearsomeTigerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shere Khan",
    version: "Fearsome Tiger",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "ON THE HUNT",
        description:
          "Whenever this character quests, banish chosen opposing damaged character. Then, you may put 1 damage counter on another chosen character.",
      },
    ],
  },
  de: {
    name: "Shir Khan",
    version: "Furchterregender Tiger",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "AUF DER JAGD",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, verbanne einen gegnerischen beschädigten Charakter deiner Wahl. Danach darfst du 1 Schadensmarker auf einen anderen Charakter deiner Wahl legen.",
      },
    ],
  },
  fr: {
    name: "Shere Khan",
    version: "Tigre redoutable",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "EN CHASSE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse avec au moins un dommage et bannissez-le. Ensuite, vous pouvez choisir un autre personnage et placer 1 dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Shere Khan",
    version: "Tigre Spaventosa",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title:
          "A CACCIA Ogni volta che questo personaggio va all'avventura, esilia un personaggio avversario danneggiato a tua scelta. Poi, puoi mettere 1 segnalino danno su un altro personaggio a tua scelta.",
      },
    ],
  },
};
