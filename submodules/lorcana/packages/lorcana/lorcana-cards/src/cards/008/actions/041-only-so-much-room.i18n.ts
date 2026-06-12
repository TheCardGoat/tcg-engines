import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const onlySoMuchRoomI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Only So Much Room",
    text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
  },
  de: {
    name: "Nicht viel Platz",
    text: "Schicke einen Charakter deiner Wahl mit 2 oder weniger zurück auf die zugehörige Hand. Nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "Qu’une toute petite place",
    text: "Choisissez un personnage avec une de 2 ou moins et renvoyez-le dans la main de son propriétaire. Renvoyez dans votre main une carte Personnage de votre défausse.",
  },
  it: {
    name: "Una Data Quantità",
    text: "Fai riprendere in mano al suo giocatore un personaggio a tua scelta con 2 o inferiore. Riprendi in mano una carta personaggio dai tuoi scarti.",
  },
};
