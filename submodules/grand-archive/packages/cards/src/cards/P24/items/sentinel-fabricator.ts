import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sentinelFabricator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j68m69iq4d",
  slug: "sentinel-fabricator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j68m69iq4d:face:default",
      catalogId: "j68m69iq4d",
      name: "Sentinel Fabricator",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DEVICE"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText: "(3), REST: Summon an Automaton Drone token with a buff counter on it.",
      abilities: [
        {
          id: "j68m69iq4d-a1",
          kind: "activated",
          text: "(3), REST: Summon an Automaton Drone token with a buff counter on it.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithCounters: [
              {
                counter: "buff",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default sentinelFabricator;
