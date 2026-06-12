import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenDisguisedPeddlerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Disguised Peddler",
    text: [
      {
        title: "A PERFECT DISGUISE",
        description:
          "{E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Verkleidete Hausiererin",
    text: [
      {
        title: "NIEMAND WIRD MICH ERKENNEN,",
        description:
          "Wirf eine Charakterkarte aus deiner Hand ab — Sammle so viele Legenden, wie der -Wert des abgeworfenen Charakters beträgt.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Déguisée en mendiante",
    text: [
      {
        title: "LE",
        description:
          "DÉGUISEMENT PARFAIT, Choisissez une carte Personnage et défaussez-la — Vous gagnez un nombre d'éclats de Lore égal à la du personnage défaussé.",
      },
    ],
  },
  it: {
    name: "The Queen",
    version: "Disguised Peddler",
    text: [
      {
        title: "A PERFECT DISGUISE,",
        description:
          "Choose and discard a character card — Gain lore equal to the discarded character's.",
      },
    ],
  },
};
