import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cosmicBolt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vpmu6gvnta",
  slug: "cosmic-bolt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vpmu6gvnta:face:default",
      catalogId: "vpmu6gvnta",
      name: "Cosmic Bolt",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)\n\nDeal 4 damage to target unit plus an additional 2 for each card named Cosmic Bolt in your graveyard and banishment.",
      abilities: [
        {
          id: "vpmu6gvnta-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (2) (As you're looking at this card while glimpsing, you may activate it by paying this cost. If you do, put all other cards you're looking at on the bottom of your deck in any order.)",
          keyword: {
            name: "starcalling",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
        },
        {
          id: "vpmu6gvnta-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target unit plus an additional 2 for each card named Cosmic Bolt in your graveyard and banishment.",
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
                  oneOf: ["ALLY", "CHAMPION"],
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
            amount: 4,
          },
        },
      ],
    },
  },
};

export default cosmicBolt;
