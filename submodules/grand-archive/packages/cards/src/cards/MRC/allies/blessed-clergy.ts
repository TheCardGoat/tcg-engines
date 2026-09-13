import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blessedClergy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a3pmmloejo",
  slug: "blessed-clergy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a3pmmloejo:face:default",
      catalogId: "a3pmmloejo",
      name: "Blessed Clergy",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)\n\n[Class Bonus] On Enter: If Blessed Clergy is imbued, target player can’t play more than two cards during their next turn.",
      abilities: [
        {
          id: "a3pmmloejo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2 (You may reserve all cards revealed as you activate this card. If at least two of them are wind element, this card becomes imbued.)",
          keyword: {
            name: "imbue",
            value: 2,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "a3pmmloejo-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: If Blessed Clergy is imbued, target player can’t play more than two cards during their next turn.",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "imbued",
            },
            then: {
              kind: "rule-modification",
              mode: "modify-limit",
              action: "play",
              subject: {
                kind: "player",
                player: {
                  binding: "target-player",
                },
              },
              amount: 2,
              duration: {
                kind: "during-next-turn",
                whose: {
                  binding: "target-player",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default blessedClergy;
