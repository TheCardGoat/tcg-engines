import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pixieDustI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pixie Dust",
    text: [
      {
        title: "FAITH AND TRUST",
        description:
          "{E}, {2} {I} — Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
      },
    ],
  },
  de: {
    name: "Feenglanz",
    text: [
      {
        title: "MUT UND VERTRAUEN, 2",
        description:
          "— Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Herausfordern +2 und Wendig. (Während der Charakter herausfordert, erhält er +2. Nur Charaktere mit Wendig können den Charakter herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Poussière de fée",
    text: [
      {
        title: "Y CROIRE DUR COMME FER, 2",
        description:
          "— Choisissez un personnage qui gagne Offensif +2 et Insaisissable jusqu'au début de votre prochain tour. (Lorsqu'il défie, ce personnage gagne +2. Seuls les personnages avec Insaisissable peuvent défier ce personnage.)",
      },
    ],
  },
  it: {
    name: "Polvere di Fata",
    text: [
      {
        title: "UN PO' DI FANTASIA, 2",
        description:
          "— Un personaggio a tua scelta ottiene Sfidante +2 e Sfuggente fino all'inizio del tuo prossimo turno. (Riceve +2 mentre sta sfidando. Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
