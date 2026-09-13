import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidestoneBovine: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "thxvlynvy5",
  slug: "tidestone-bovine",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "thxvlynvy5:face:default",
      catalogId: "thxvlynvy5",
      name: "Tidestone Bovine",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BULL"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Attack: Target player puts the top two cards of their deck into their graveyard.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "thxvlynvy5-a1",
          kind: "triggered",
          text: "On Attack: Target player puts the top two cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
        {
          id: "thxvlynvy5-a2",
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

export default tidestoneBovine;
