import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const legendOfTheSwordInTheStoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Legend of the Sword in the Stone",
    text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  },
  de: {
    name: "Die Legende vom Schwert in dem Stein",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +3. (Während der Charakter herausfordert, erhält er +3 {S}.)",
  },
  fr: {
    name: "La légende de l'épée dans l'enclume",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage, il gagne <Offensif> + 3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "La Leggenda della Spada nella Roccia",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta ottiene <Sfidante> +3 per questo turno. (Riceve +3 {S} mentre sta sfidando.)",
      },
    ],
  },
};
