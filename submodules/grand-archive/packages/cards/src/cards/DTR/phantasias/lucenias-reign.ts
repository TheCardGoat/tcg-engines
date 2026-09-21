import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const luceniasReign: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zrvvwz3ww9",
  slug: "lucenias-reign",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zrvvwz3ww9:face:default",
      catalogId: "zrvvwz3ww9",
      name: "Lucenia's Reign",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CHESSMAN", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n(2), Discard a Chessman Command card: Target Chessman ally you control gets +1LIFE until end of turn. Draw a card into your memory.\n",
      abilities: [
        {
          id: "zrvvwz3ww9-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "zrvvwz3ww9-a2",
          kind: "activated",
          text: "(2), Discard a Chessman Command card: Target Chessman ally you control gets +1LIFE until end of turn. Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "hand",
                to: "graveyard",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["COMMAND"],
                    },
                  ],
                },
              },
            ],
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["CHESSMAN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "life",
                  operation: "add",
                  amount: 1,
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default luceniasReign;
