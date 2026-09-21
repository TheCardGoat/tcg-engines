import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recursiveConfidant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KfC8fwcF2T",
  slug: "recursive-confidant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KfC8fwcF2T:face:default",
      catalogId: "KfC8fwcF2T",
      name: "Recursive Confidant",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Until end of turn, you may activate target Warrior attack card in your banishment. (You still pay its costs.)",
      abilities: [
        {
          id: "KfC8fwcF2T-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Until end of turn, you may activate target Warrior attack card in your banishment. (You still pay its costs.)",
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
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ATTACK"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["WARRIOR"],
                    },
                  ],
                },
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
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            affectedSet: "locked",
            fromZone: "banishment",
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default recursiveConfidant;
