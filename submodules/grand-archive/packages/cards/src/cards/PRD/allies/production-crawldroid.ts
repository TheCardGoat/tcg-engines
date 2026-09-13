import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const productionCrawldroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AVgvV2L2k7",
  slug: "production-crawldroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AVgvV2L2k7:face:default",
      catalogId: "AVgvV2L2k7",
      name: "Production Crawldroid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText: "On Enter: Summon two Powercell tokens.",
      abilities: [
        {
          id: "AVgvV2L2k7-a1",
          kind: "triggered",
          text: "On Enter: Summon two Powercell tokens.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default productionCrawldroid;
