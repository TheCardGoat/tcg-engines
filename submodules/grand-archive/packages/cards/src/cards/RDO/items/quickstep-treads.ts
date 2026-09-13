import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const quickstepTreads: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rZ6LEFqqIS",
  slug: "quickstep-treads",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rZ6LEFqqIS:face:default",
      catalogId: "rZ6LEFqqIS",
      name: "Quickstep Treads",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\n[Class Bonus] As long as your champion is distant and it's your turn, cards your opponents activate cost (2) more to activate.",
      abilities: [
        {
          id: "rZ6LEFqqIS-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "rZ6LEFqqIS-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as your champion is distant and it's your turn, cards your opponents activate cost (2) more to activate.",
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
                kind: "player",
                player: "opponent",
              },
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                  {
                    kind: "object-state",
                    state: "distant",
                  },
                ],
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default quickstepTreads;
