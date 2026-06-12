import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kingCandyRoyalRacerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "King Candy",
    version: "Royal Racer",
    text: [
      {
        title: "SWEET REVENGE",
        description:
          "Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
      },
    ],
  },
  de: {
    name: "King Candy",
    version: "Königlicher Rennfahrer",
    text: [
      {
        title: "SÜSSE RACHE",
        description:
          "Jedes Mal, wenn einer deiner anderen Rennfahrer verbannt wird, wählen alle gegnerischen Mitspielenden je einen ihrer Charaktere und verbannen ihn.",
      },
    ],
  },
  fr: {
    name: "Sa Sucrerie",
    version: "Pilote royal",
    text: [
      {
        title: "DOUCE REVANCHE",
        description:
          "Chaque fois que l'un de vos autres personnages Pilote est banni, chaque adversaire choisit l'un de ses personnages et le bannit.",
      },
    ],
  },
  it: {
    name: "Re Candito",
    version: "Pilota Reale",
    text: [
      {
        title: "DOLCE VENDETTA",
        description:
          "Ogni volta che uno dei tuoi altri personaggi Pilota viene esiliato, ogni avversario sceglie ed esilia uno dei suoi personaggi.",
      },
    ],
  },
};
