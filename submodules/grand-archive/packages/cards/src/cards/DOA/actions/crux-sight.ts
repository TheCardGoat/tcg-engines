import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cruxSight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "P9Y1Q5cQ0F",
  slug: "crux-sight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "P9Y1Q5cQ0F:face:default",
      catalogId: "P9Y1Q5cQ0F",
      name: "Crux Sight",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, you may pay (2). If you do, banish this card as it resolves and it gains “Return a crux element card from your graveyard to your hand.” \n\nDraw a card.",
      abilities: [
        {
          id: "P9Y1Q5cQ0F-a1",
          kind: "card-resolution",
          text: "As an additional cost to activate this card, you may pay (2). If you do, banish this card as it resolves and it gains “Return a crux element card from your graveyard to your hand.”",
          additionalCost: {
            kind: "optional",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            bindPaidAs: "paid-crux-sight",
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "paid-cost",
              binding: "paid-crux-sight",
            },
            then: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "choose",
                  selection: {
                    id: "returned-crux-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["CRUX"],
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "returned-crux-card",
                    },
                    from: "graveyard",
                    destination: {
                      zone: "hand",
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: "P9Y1Q5cQ0F-a2",
          kind: "card-resolution",
          text: "Draw a card.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default cruxSight;
