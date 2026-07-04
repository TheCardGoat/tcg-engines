import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const butImMuchFasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "But I'm Much Faster",
    text: "Chosen character gains Alert and Challenger +2 this turn. (They can challenge as if they had Evasive. They get +2 {S} while challenging.)",
  },
  de: {
    name: "Doch ich bin schneller",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug <Alarmiert> und <Herausfordern> +2. (Der Charakter kann herausfordern, als hätte er Wendig. Während er herausfordert, erhält er +2 {S}.)",
  },
  fr: {
    name: "Quelle poursuite infernale",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 1 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui gagne <Agilité> et <Offensif> +2 pour le reste de ce tour. (Il peut défier comme s'il avait Insaisissable. Lorsqu'il défie, ce personnage gagne +2 {S}.)",
      },
    ],
  },
  it: {
    name: "Scappiamo da Qui",
    text: [
      {
        title:
          "(Un personaggio con costo 1 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta ottiene <Vigile> e <Sfidante> +2 per questo turno. (Può sfidare come se avesse Sfuggente. Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
};
