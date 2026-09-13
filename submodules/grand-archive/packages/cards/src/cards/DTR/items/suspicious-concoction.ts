import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const suspiciousConcoction: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5tphi6xl26",
  slug: "suspicious-concoction",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5tphi6xl26:face:default",
      catalogId: "5tphi6xl26",
      name: "Suspicious Concoction",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever your champion levels up, you may banish Suspicious Concoction. If you do, draw a card into your memory and recover 2.",
      abilities: [
        {
          id: "5tphi6xl26-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, you may banish Suspicious Concoction. If you do, draw a card into your memory and recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                      to: "memory",
                    },
                    {
                      kind: "recover",
                      player: "controller",
                      amount: 2,
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default suspiciousConcoction;
