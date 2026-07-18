import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const youveGotSomePunchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "You've Got Some Punch",
    text: "Chosen character gains rush and Challenger +2 this turn. (They can challenge the turn they're played. They get +2 strength while challenging.)",
  },
  de: {
    name: "Du hast jetzt Feuer",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug <Rasant> und <Herausfordern> +2. (Er kann im selben Zug herausfordern, in dem er ausgespielt wird. Während er herausfordert, erhält er +2 {S}.)",
  },
  fr: {
    name: "Enfile tes gants",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui gagne <Charge> et <Offensif> +2 pour le reste de ce tour. (Ce personnage peut défier le tour où il est joué. Lorsqu'il défie, ce personnage gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Adesso la Tua Forza È Mitica",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta ottiene <Lesto> e <Sfidante> +2 per questo turno. (Può sfidare nel turno in cui viene giocato. Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
  es: {
    name: "Tienes algo de ponche",
    text: "El personaje elegido gana Rush y Challenger +2 este turno. (Pueden desafiar el turno en el que se juega. Obtienen +2 de fuerza mientras desafían).",
  },
};
