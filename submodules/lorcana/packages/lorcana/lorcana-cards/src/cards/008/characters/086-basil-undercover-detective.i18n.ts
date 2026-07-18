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
        title: "Außer Gefecht setzen",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      },
      {
        title: "Eingreifen",
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
        title: "Neutraliser",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et le renvoyer dans la main de son propriétaire.",
      },
      {
        title: "Interférer",
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
        title: "Neutralizzare",
        description:
          "Quando giochi questo personaggio, puoi far riprendere in mano al suo giocatore un personaggio a tua scelta.",
      },
      {
        title: "Interferire",
        description:
          "Ogni volta che questo personaggio va all'avventura, un avversario a tua scelta scarta una carta a caso.",
      },
    ],
  },
  es: {
    name: "Albahaca",
    version: "Detective encubierto",
    text: [
      {
        title: "INCAPACITAR",
        description:
          "Cuando juegas con este personaje, puedes devolver el personaje elegido a la mano de su jugador.",
      },
      {
        title: "INTERFERIR",
        description:
          "Cada vez que este personaje realiza una misión, el oponente elegido descarta una carta al azar.",
      },
    ],
  },
};
