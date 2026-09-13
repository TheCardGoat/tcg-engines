import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellProduction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m6lGw6bQtb",
  slug: "cell-production",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m6lGw6bQtb:face:default",
      catalogId: "m6lGw6bQtb",
      name: "Cell Production",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON", "CRAFT"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Summon two Powercell tokens rested.",
      abilities: [
        {
          id: "m6lGw6bQtb-a1",
          kind: "card-resolution",
          text: "Summon two Powercell tokens rested.",
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default cellProduction;
