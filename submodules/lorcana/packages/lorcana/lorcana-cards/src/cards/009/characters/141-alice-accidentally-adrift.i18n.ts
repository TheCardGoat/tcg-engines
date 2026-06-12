import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceAccidentallyAdriftI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Accidentally Adrift",
    text: [
      {
        title: "WASHED AWAY",
        description:
          "When you play this character, you may put chosen item into its player's inkwell facedown and exerted.",
      },
      {
        title: "MAKING WAVES",
        description:
          "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Versehentlich verirrt",
    text: [
      {
        title: "WEGGESPÜLT",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat legen.",
      },
      {
        title: "WELLEN SCHLAGEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Accidentellement à la dérive",
    text: [
      {
        title: "À VAU-L'EAU",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un objet et le placer dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
      },
      {
        title: "FAIRE DES VAGUES",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Naufraga per Caso",
    text: [
      {
        title: "PORTATA VIA",
        description:
          "Quando giochi questo personaggio, puoi aggiungere un oggetto a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
      },
      {
        title: "SMUOVERE LE ACQUE",
        description:
          "Ogni volta che questo personaggio va all'avventura, un personaggio avversario a tua scelta riceve -2 per questo turno.",
      },
    ],
  },
};
