import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ingressOfSanguineIre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dfchplzf6m",
  slug: "ingress-of-sanguine-ire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dfchplzf6m:face:default",
      catalogId: "dfchplzf6m",
      name: "Ingress of Sanguine Ire",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only during an opponent's end phase.\n\nYour champion's first attack during your next turn gets +3 POWER. If your champion hasn't taken damage this turn, draw two cards into your memory.",
      abilities: [
        {
          id: "dfchplzf6m-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only during an opponent's end phase.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
                    kind: "phase",
                    phase: "end",
                  },
                  {
                    kind: "turn-player",
                    player: "opponent",
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dfchplzf6m-a2",
          kind: "card-resolution",
          text: "Your champion's first attack during your next turn gets +3 POWER. If your champion hasn't taken damage this turn, draw two cards into your memory.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  },
                },
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: 3,
                  },
                },
                starts: {
                  kind: "next-turn",
                  whose: "controller",
                },
                limit: 1,
                expires: {
                  kind: "until-end-of-turn",
                  whose: "controller",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "not",
                  condition: {
                    kind: "history",
                    event: "damage-dealt",
                    window: "this-turn",
                    recipient: {
                      kind: "champion",
                      player: "controller",
                    },
                    minimum: 1,
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default ingressOfSanguineIre;
