import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reclaim: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "F2wp1v0Tyk",
  slug: "reclaim",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "F2wp1v0Tyk:face:default",
      catalogId: "F2wp1v0Tyk",
      name: "Reclaim",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Return target ally you control to its owner's hand.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "F2wp1v0Tyk-a1",
          kind: "card-resolution",
          text: "Return target ally you control to its owner's hand.",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "hand",
            },
          },
        },
        {
          id: "F2wp1v0Tyk-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default reclaim;
