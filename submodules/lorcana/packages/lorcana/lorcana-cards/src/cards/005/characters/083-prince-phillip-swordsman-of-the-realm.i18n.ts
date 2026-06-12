import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princePhillipSwordsmanOfTheRealmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince Phillip",
    version: "Swordsman of the Realm",
    text: [
      {
        title: "SLAYER OF DRAGONS",
        description: "When you play this character, banish chosen opposing Dragon character.",
      },
      {
        title: "PRESSING THE ADVANTAGE",
        description:
          "Whenever he challenges a damaged character, ready this character after the challenge.",
      },
    ],
  },
  de: {
    name: "Prinz Phillip",
    version: "Schwertkämpfer des Königreichs",
    text: [
      {
        title: "DRACHENBEZWINGER",
        description:
          "Wenn du diesen Charakter ausspielst, verbanne einen gegnerischen Drachen deiner Wahl.",
      },
      {
        title: "DEN VORTEIL AUSNUTZEN",
        description:
          "Jedes Mal, wenn dieser Charakter einen beschädigten Charakter herausfordert, mache diesen Charakter nach der Herausforderung bereit.",
      },
    ],
  },
  fr: {
    name: "Prince Philippe",
    version: "Épéiste du royaume",
    text: [
      {
        title: "POURFENDEUR DE DRAGONS",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Dragon adverse et bannissez-le.",
      },
      {
        title: "PROFITER DE L'AVANTAGE",
        description:
          "Chaque fois que ce personnage défie un personnage ayant au moins un dommage sur lui, redressez ce personnage-ci après le défi.",
      },
    ],
  },
  it: {
    name: "Principe Filippo",
    version: "Spadaccino del Regno",
    text: [
      {
        title: "UCCISORE DI DRAGHI",
        description:
          "Quando giochi questo personaggio, esilia un personaggio Drago avversario a tua scelta.",
      },
      {
        title: "SFRUTTARE IL VANTAGGIO",
        description:
          "Ogni volta che sfida un personaggio danneggiato, prepara questo personaggio dopo la sfida.",
      },
    ],
  },
};
