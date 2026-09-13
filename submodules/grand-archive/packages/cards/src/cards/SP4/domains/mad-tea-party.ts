import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const madTeaParty: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eaxvvj7hz3",
  slug: "mad-tea-party",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eaxvvj7hz3:face:default",
      catalogId: "eaxvvj7hz3",
      name: "Mad Tea Party",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SIEGEABLE", "PARTY"],
      },
      elements: ["NORM"],
      stats: {
        durability: 6,
      },
      rulesText:
        "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)\n\nWhenever an ally enters the field, recover 1. (To recover, remove that many durability counters from your champion.)",
      abilities: [
        {
          id: "eaxvvj7hz3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Siegeable — This domain can be attacked. It takes damage in the form of removing durability counters.)",
          keyword: {
            name: "siegeable",
          },
        },
        {
          id: "eaxvvj7hz3-a2",
          kind: "triggered",
          text: "Whenever an ally enters the field, recover 1. (To recover, remove that many durability counters from your champion.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default madTeaParty;
