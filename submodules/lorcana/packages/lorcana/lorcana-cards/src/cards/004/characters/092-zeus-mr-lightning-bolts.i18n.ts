import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zeusMrLightningBoltsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zeus",
    version: "Mr. Lightning Bolts",
    text: [
      {
        title: "TARGET PRACTICE",
        description:
          "Whenever this character challenges another character, he gets +{S} equal to the {S} of chosen character this turn.",
      },
    ],
  },
  de: {
    name: "Zeus",
    version: "Der geölte Blitz persönlich",
    text: [
      {
        title: "ZIELSCHEIBEN",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, erhält er in diesem Zug so viel +, wie die eines Charakters deiner Wahl beträgt.",
      },
    ],
  },
  fr: {
    name: "Zeus",
    version: "M. Crache-la-Foudre",
    text: [
      {
        title: "TIRER COMME DES PIGEONS",
        description:
          "Chaque fois que ce personnage en défie un autre, choisissez un personnage et ajoutez sa à celle de ce personnage-ci.",
      },
    ],
  },
  it: {
    name: "Zeus",
    version: "Mister Fulmini e Saette",
    text: [
      {
        title: "TIRO AL BERSAGLIO",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, riceve + pari alla di un personaggio a tua scelta per questo turno.",
      },
    ],
  },
};
