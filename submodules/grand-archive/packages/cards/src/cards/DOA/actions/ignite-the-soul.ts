import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const igniteTheSoul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rXHo9fLU32",
  slug: "ignite-the-soul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rXHo9fLU32:face:default",
      catalogId: "rXHo9fLU32",
      name: "Ignite the Soul",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "Deal 1 damage to target unit.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "rXHo9fLU32-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit.",
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
            amount: 1,
          },
        },
        {
          id: "rXHo9fLU32-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default igniteTheSoul;
