import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hypnoticStrengthI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hypnotic Strength",
    text: "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  },
  de: {
    name: "Hypnotische Kräfte",
    text: "Ziehe 1 Karte. Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
  },
  fr: {
    name: "Force hypnotique",
    text: "Piochez une carte. Choisissez un personnage qui gagne <Offensif> +2 pour le reste de ce tour.",
  },
  it: {
    name: "Forza Ipnotica",
    text: "Pesca una carta. Un personaggio a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
  },
  es: {
    name: "Fuerza hipnótica",
    text: "Saca una carta. El personaje elegido gana Challenger +2 este turno. (Obtienen +2 {S} mientras desafían).",
  },
};
