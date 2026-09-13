import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const opticalControl: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j4U5Tu76Lz",
  slug: "optical-control",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j4U5Tu76Lz:face:default",
      catalogId: "j4U5Tu76Lz",
      name: "Optical Control",
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
      elements: ["LUXEM"],
      stats: {},
      rulesText:
        "As Optical Control enters the field, choose a card type. \n\nCards of the chosen type your opponents activate cost (4) more to activate.\n\nAt the beginning of your recollection phase, sacrifice Optical Control and draw a card.",
      abilities: [
        {
          id: "j4U5Tu76Lz-a1",
          kind: "static",
          staticKind: "effects",
          text: "As Optical Control enters the field, choose a card type.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose-value",
                  selection: {
                    id: "entry-choice",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "characteristic",
                      characteristic: "type",
                    },
                  },
                  trackAs: "chosen-card-type",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "j4U5Tu76Lz-a2",
          kind: "static",
          staticKind: "effects",
          text: "Cards of the chosen type your opponents activate cost (4) more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              filter: {
                kind: "matches-tracked-characteristic",
                key: "chosen-card-type",
                characteristic: "type",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 4,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "j4U5Tu76Lz-a3",
          kind: "triggered",
          text: "At the beginning of your recollection phase, sacrifice Optical Control and draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default opticalControl;
