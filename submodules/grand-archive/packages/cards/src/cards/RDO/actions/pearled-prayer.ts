import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pearledPrayer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "HLcmZLe7Xr",
  slug: "pearled-prayer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "HLcmZLe7Xr:face:default",
      catalogId: "HLcmZLe7Xr",
      name: "Pearled Prayer",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card into your memory. If you activated this card during your main phase, recover 7. Otherwise, recover 4.",
      abilities: [
        {
          id: "HLcmZLe7Xr-a1",
          kind: "card-resolution",
          text: "Draw a card into your memory. If you activated this card during your main phase, recover 7. Otherwise, recover 4.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "source-activation-context",
                  phase: "main",
                },
                then: {
                  kind: "recover",
                  player: "controller",
                  amount: 7,
                },
                else: {
                  kind: "recover",
                  player: "controller",
                  amount: 4,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pearledPrayer;
