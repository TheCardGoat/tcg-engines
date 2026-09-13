import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const engineeredSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kkz07nau5s",
  slug: "engineered-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kkz07nau5s:face:default",
      catalogId: "kkz07nau5s",
      name: "Engineered Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "AUTOMATON", "BEAST", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Pride 2\n\n[Class Bonus] Whenever you sacrifice a Powercell, choose one—\n• Put a buff counter on Engineered Slime.\n• Engineered Slime gains spellshroud until end of turn.",
      abilities: [
        {
          id: "kkz07nau5s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 2",
          keyword: {
            name: "pride",
            value: 2,
          },
        },
        {
          id: "kkz07nau5s-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you sacrifice a Powercell, choose one—\n• Put a buff counter on Engineered Slime.\n• Engineered Slime gains spellshroud until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "object-sacrificed",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POWERCELL"],
                },
              },
            },
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
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Put a buff counter on Engineered Slime.",
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
              {
                id: "mode-2",
                text: "Engineered Slime gains spellshroud until end of turn",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
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
                    kind: "grant-keyword",
                    keyword: {
                      name: "spellshroud",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default engineeredSlime;
