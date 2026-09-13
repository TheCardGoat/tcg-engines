import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reversalsPolarity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zVdqJRbsk1",
  slug: "reversals-polarity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zVdqJRbsk1:face:default",
      catalogId: "zVdqJRbsk1",
      name: "Reversal's Polarity",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "Whenever an arcane element card activation you control is negated, deal X damage to target champion, where X is that card's reserve cost.",
      abilities: [
        {
          id: "zVdqJRbsk1-a1",
          kind: "triggered",
          text: "Whenever an arcane element card activation you control is negated, deal X damage to target champion, where X is that card's reserve cost.",
          trigger: {
            kind: "event",
            event: {
              name: "stack-item-negated",
              itemTypes: ["card-activation"],
              controller: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
              },
            },
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default reversalsPolarity;
