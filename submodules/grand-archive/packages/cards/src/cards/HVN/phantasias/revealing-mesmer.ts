import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const revealingMesmer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "l7pnn9jw7c",
  slug: "revealing-mesmer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "l7pnn9jw7c:face:default",
      catalogId: "l7pnn9jw7c",
      name: "Revealing Mesmer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(2), REST: Each champion loses spellshroud until end of turn.\n\n(2), REST: Change the target of an activation or trigger that targets a phantasia you control to Revealing Mesmer.\n",
      abilities: [
        {
          id: "l7pnn9jw7c-a1",
          kind: "activated",
          text: "(2), REST: Each champion loses spellshroud until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "remove-keyword",
              keyword: {
                name: "spellshroud",
              },
            },
          },
        },
        {
          id: "l7pnn9jw7c-a2",
          kind: "activated",
          text: "(2), REST: Change the target of an activation or trigger that targets a phantasia you control to Revealing Mesmer.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["ability", "card-activation"],
                targeting: {
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "retarget",
            subject: {
              kind: "bound",
              binding: "target-stack-item",
            },
            chooser: "controller",
            newTarget: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default revealingMesmer;
