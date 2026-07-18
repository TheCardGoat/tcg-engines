import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarAspiringRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Aspiring Ruler",
    text: [
      {
        title: "THAT'S BETTER",
        description:
          "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Aufstrebender Herrscher",
    text: [
      {
        title: "So ist es besser",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}).",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Aspirant souverain",
    text: [
      {
        title: "Voilà qui est mieux",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Aspirante Monarca",
    text: [
      {
        title: "Così va Meglio",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Jafar",
    version: "Aspirante a gobernante",
    text: [
      {
        title: "ESO ES MEJOR",
        description:
          "Cuando juegas con este personaje, el personaje elegido gana Challenger +2 este turno. (Obtienen +2 {S} mientras desafían).",
      },
    ],
  },
};
