import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const undermineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Undermine",
    text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
  },
  de: {
    name: "Sabotieren",
    text: "Eine gegnerische Person deiner Wahl wählt 1 Karte aus ihrer Hand und wirft sie ab. Gib einem Charakter deiner Wahl in diesem Zug +2.",
  },
  fr: {
    name: "Bousillage",
    text: "Choisissez un adversaire qui défausse une carte. Choisissez un personnage qui gagne +2 pour le reste de ce tour.",
  },
  it: {
    name: "Sabotare",
    text: "Un avversario a tua scelta sceglie e scarta una carta. Un personaggio a tua scelta riceve +2 per questo turno.",
  },
};
