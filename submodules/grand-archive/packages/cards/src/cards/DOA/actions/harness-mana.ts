import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harnessMana: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "G2XFRE8rFX",
  slug: "harness-mana",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "G2XFRE8rFX:face:default",
      catalogId: "G2XFRE8rFX",
      name: "Harness Mana",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put any amount of cards from your hand into your memory. \n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "G2XFRE8rFX-a1",
          kind: "card-resolution",
          text: "Put any amount of cards from your hand into your memory.",
          effect: {
            kind: "choose",
            selection: {
              id: "cards-to-memory",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "cards-to-memory",
              },
              from: "hand",
              destination: {
                zone: "memory",
              },
            },
          },
        },
        {
          id: "G2XFRE8rFX-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
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

export default harnessMana;
