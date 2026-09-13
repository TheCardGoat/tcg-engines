import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const liuBeiOathkeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a53rqmuqxf",
  slug: "liu-bei-oathkeeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a53rqmuqxf:face:default",
      catalogId: "a53rqmuqxf",
      name: "Liu Bei, Oathkeeper",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Ranged 2\n\nWhenever another unit you control becomes distant, Liu Bei becomes distant. (Units stay distant until the end of their controller's turn.)",
      abilities: [
        {
          id: "a53rqmuqxf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "a53rqmuqxf-a2",
          kind: "triggered",
          text: "Whenever another unit you control becomes distant, Liu Bei becomes distant. (Units stay distant until the end of their controller's turn.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
              state: "distant",
              to: true,
            },
          },
          effect: {
            kind: "set-object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
            value: true,
          },
        },
      ],
    },
  },
};

export default liuBeiOathkeeper;
