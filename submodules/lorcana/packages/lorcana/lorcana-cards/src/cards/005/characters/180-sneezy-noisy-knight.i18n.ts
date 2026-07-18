import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sneezyNoisyKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sneezy",
    version: "Noisy Knight",
    text: [
      {
        title: "HEADWIND",
        description:
          "When you play this character, chosen Knight character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Hatschi",
    version: "Ritter der Geräusche",
    text: [
      {
        title: "Gegenwind",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Ritter deiner Wahl in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
    ],
  },
  fr: {
    name: "Atchoum",
    version: "Chevalier bruyant",
    text: [
      {
        title: "Vent contraire",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage Chevalier qui gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Eolo",
    version: "Cavaliere Rumoroso",
    text: [
      {
        title: "Vento Contrario",
        description:
          "Quando giochi questo personaggio, un personaggio Cavaliere a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Estornudo",
    version: "Caballero ruidoso",
    text: [
      {
        title: "VIENTO EN CONTRA",
        description:
          "Cuando juegas con este personaje, el personaje Caballero elegido obtiene Retador +2 este turno. (Obtienen +2 {S} mientras desafían).",
      },
    ],
  },
};
