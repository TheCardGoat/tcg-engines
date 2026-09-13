import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intensifiedPyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hd0sxpu7cp",
  slug: "intensified-pyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hd0sxpu7cp:face:default",
      catalogId: "hd0sxpu7cp",
      name: "Intensified Pyre",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.) \n\nDeal 2 damage to target champion. If that champion's controller has eight or more cards in their graveyard, deal 6 damage to that champion instead.",
      abilities: [
        {
          id: "hd0sxpu7cp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 3 (You may banish up to three fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card's cost.)",
          keyword: {
            name: "kindle",
            value: 3,
          },
        },
        {
          id: "hd0sxpu7cp-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target champion. If that champion's controller has eight or more cards in their graveyard, deal 6 damage to that champion instead.",
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
              kind: "conditional",
              condition: {
                kind: "player-zone-count",
                players: {
                  controllerOf: "target-1",
                },
                quantifier: "all",
                zone: "graveyard",
                operator: "gte",
                value: 8,
              },
              then: 6,
              else: 2,
            },
          },
        },
      ],
    },
  },
};

export default intensifiedPyre;
