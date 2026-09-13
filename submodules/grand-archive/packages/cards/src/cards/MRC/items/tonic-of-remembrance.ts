import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tonicOfRemembrance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uqrptjej4m",
  slug: "tonic-of-remembrance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uqrptjej4m:face:default",
      catalogId: "uqrptjej4m",
      name: "Tonic of Remembrance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — One Catalyst, One Adjuvant\n\n[Class Bonus] Banish Tonic of Remembrance: Return up to three cards from your memory to your hand.",
      abilities: [
        {
          id: "uqrptjej4m-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Catalyst, One Adjuvant",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Catalyst",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Adjuvant",
                count: 1,
              },
            ],
          },
        },
        {
          id: "uqrptjej4m-a2",
          kind: "activated",
          text: "[Class Bonus] Banish Tonic of Remembrance: Return up to three cards from your memory to your hand.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
          effect: {
            kind: "choose",
            selection: {
              id: "memory-cards-to-hand",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: "controller",
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "memory-cards-to-hand",
              },
              from: "memory",
              destination: {
                zone: "hand",
              },
            },
          },
        },
      ],
    },
  },
};

export default tonicOfRemembrance;
