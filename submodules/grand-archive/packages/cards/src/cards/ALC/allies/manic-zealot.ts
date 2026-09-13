import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manicZealot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ttkk39i1f0",
  slug: "manic-zealot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ttkk39i1f0:face:default",
      catalogId: "ttkk39i1f0",
      name: "Manic Zealot",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "On Death: Deal 2 damage to each champion.",
      abilities: [
        {
          id: "ttkk39i1f0-a1",
          kind: "triggered",
          text: "On Death: Deal 2 damage to each champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default manicZealot;
