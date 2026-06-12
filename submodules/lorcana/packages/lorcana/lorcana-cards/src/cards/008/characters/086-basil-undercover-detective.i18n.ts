import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilUndercoverDetectiveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Undercover Detective",
    text: [
      {
        title: "INCAPACITATE",
        description:
          "When you play this character, you may return chosen character to their player's hand.",
      },
      {
        title: "INTERFERE",
        description: "Whenever this character quests, chosen opponent discards a card at random.",
      },
    ],
  },
  de: {
    name: "Basil",
    version: "Verdeckter Ermittler",
    text: [
      {
        title: "AUSSER GEFECHT SETZEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      },
      {
        title: "EINGREIFEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, wirft eine gegnerische Person deiner Wahl 1 zufällig ausgewählte Karte aus ihrer Hand ab.",
      },
    ],
  },
  fr: {
    name: "Basil",
    version: "Détective infiltré",
    text: [
      {
        title: "NEUTRALISER",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et le renvoyer dans la main de son propriétaire.",
      },
      {
        title: "INTERFÉRER",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un adversaire qui défausse une carte au hasard.",
      },
    ],
  },
  it: {
    name: "Basil",
    version: "Detective Sotto Copertura",
    text: [
      {
        title: "NEUTRALIZZARE",
        description:
          "Quando giochi questo personaggio, puoi far riprendere in mano al suo giocatore un personaggio a tua scelta.",
      },
      {
        title: "INTERFERIRE",
        description:
          "Ogni volta che questo personaggio va all'avventura, un avversario a tua scelta scarta una carta a caso.",
      },
    ],
  },
};
