import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const restoringEmbers: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FnTT1G4OQg",
  slug: "restoring-embers",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FnTT1G4OQg:face:default",
      catalogId: "FnTT1G4OQg",
      name: "Restoring Embers",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Kindle 4 (You may banish up to four fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)\n\nRecover 4. Then if your influence is four or less, draw a card into your memory.\n",
      abilities: [
        {
          id: "FnTT1G4OQg-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 4 (You may banish up to four fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)",
          keyword: {
            name: "kindle",
            value: 4,
          },
        },
        {
          id: "FnTT1G4OQg-a2",
          kind: "card-resolution",
          text: "Recover 4. Then if your influence is four or less, draw a card into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 4,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "player-property",
                      player: "controller",
                      property: "influence",
                    },
                    operator: "lte",
                    right: 4,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default restoringEmbers;
