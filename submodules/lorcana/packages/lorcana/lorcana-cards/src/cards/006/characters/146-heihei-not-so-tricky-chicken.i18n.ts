import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heiheiNotsotrickyChickenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heihei",
    version: "Not-So-Tricky Chicken",
    text: [
      {
        title: "EAT ANYTHING",
        description:
          "When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
      },
      {
        title: "OUT TO LUNCH",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "HeiHei",
    version: "Weniger trickreiches Hühnchen",
    text: [
      {
        title: "ISST ALLES",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe einen gegnerischen Gegenstand deiner Wahl. Er wird zu Beginn seines nächsten Zuges nicht bereit gemacht.",
      },
      {
        title: "ZUM ESSEN UNTERWEGS",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Heihei",
    version: "Poulet pas si malin",
    text: [
      {
        title: "MANGER N'IMPORTE QUOI",
        description:
          "Lorsque vous jouez ce personnage, choisissez un objet adverse et épuisez-le. Il ne se redresse pas au début de son prochain tour.",
      },
      {
        title: "PAUSE DÉJEUNER",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Heihei",
    version: "Pollo Non Particolarmente Furbo",
    text: [
      {
        title: "MANGIARE QUALSIASI COSA",
        description:
          "Quando giochi questo personaggio, impegna un oggetto avversario a tua scelta. Non si può preparare all'inizio del suo prossimo turno.",
      },
      {
        title: "FUORI A PRANZO",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
