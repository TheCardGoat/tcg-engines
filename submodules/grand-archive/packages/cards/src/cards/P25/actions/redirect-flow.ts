import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const redirectFlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a6h0rcs8sw",
  slug: "redirect-flow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a6h0rcs8sw:face:default",
      catalogId: "a6h0rcs8sw",
      name: "Redirect Flow",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nYou may choose new targets for target trigger.",
      abilities: [
        {
          id: "a6h0rcs8sw-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "a6h0rcs8sw-a2",
          kind: "card-resolution",
          text: "You may choose new targets for target trigger.",
          targets: [
            {
              id: "target-trigger",
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
                itemTypes: ["ability"],
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "retarget",
              subject: {
                kind: "bound",
                binding: "target-trigger",
              },
              chooser: "controller",
            },
          },
        },
      ],
    },
  },
};

export default redirectFlow;
