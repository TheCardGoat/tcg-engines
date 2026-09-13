import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const speedPotion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0Z1r8GC8a8",
  slug: "speed-potion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0Z1r8GC8a8:face:default",
      catalogId: "0Z1r8GC8a8",
      name: "Speed Potion",
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
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Brew — Two Herbs \n\nOn Enter: If Speed Potion was brewed, draw a card.\n\nSacrifice Speed Potion: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "0Z1r8GC8a8-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
          },
        },
        {
          id: "0Z1r8GC8a8-a2",
          kind: "triggered",
          text: "On Enter: If Speed Potion was brewed, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "brewed",
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
            },
          },
        },
        {
          id: "0Z1r8GC8a8-a3",
          kind: "activated",
          text: "Sacrifice Speed Potion: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default speedPotion;
