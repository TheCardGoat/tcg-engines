import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const krustallanRuins: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fei7chsbal",
  slug: "krustallan-ruins",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fei7chsbal:face:default",
      catalogId: "fei7chsbal",
      name: "Krustallan Ruins",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "RUINS"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever an ally enters the field under a player’s control, rest that ally unless that player pays (1).",
      abilities: [
        {
          id: "fei7chsbal-a1",
          kind: "triggered",
          text: "Whenever an ally enters the field under a player’s control, rest that ally unless that player pays (1).",
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
            kind: "unless-paid",
            player: "event-recipient-controller",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
            otherwise: {
              kind: "rest",
              subject: {
                kind: "event-subject",
              },
            },
          },
        },
      ],
    },
  },
};

export default krustallanRuins;
