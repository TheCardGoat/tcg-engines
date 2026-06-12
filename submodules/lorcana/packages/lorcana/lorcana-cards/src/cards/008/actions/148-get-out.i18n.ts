import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const getOutI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Get Out!",
    text: "Banish chosen character, then return an item card from your discard to your hand.",
  },
  de: {
    name: "Verschwinde hier!",
    text: "Verbanne einen Charakter deiner Wahl. Nimm 1 Gegenstandskarte aus deinem Ablagestapel zurück auf deine Hand.",
  },
  fr: {
    name: "Allez-vous-en !",
    text: "Choisissez un personnage et bannissez-le, puis renvoyez dans votre main une carte Objet de votre défausse.",
  },
  it: {
    name: "Vattene!",
    text: "Esilia un personaggio a tua scelta, poi riprendi in mano una carta oggetto dai tuoi scarti.",
  },
};
