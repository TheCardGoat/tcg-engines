import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const splashingSpearguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4a87hk0bkh",
  slug: "splashing-spearguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4a87hk0bkh:face:default",
      catalogId: "4a87hk0bkh",
      name: "Splashing Spearguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are water element, this card becomes imbued.)\n\nOn Enter: If Splashing Spearguard is imbued, target player puts the top two cards of their deck into their graveyard.",
      abilities: [
        {
          id: "4a87hk0bkh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3 (You may reserve all cards revealed as you activate this card. If at least three of them are water element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "4a87hk0bkh-a2",
          kind: "triggered",
          text: "On Enter: If Splashing Spearguard is imbued, target player puts the top two cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "mill",
              player: {
                binding: "target-player",
              },
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default splashingSpearguard;
