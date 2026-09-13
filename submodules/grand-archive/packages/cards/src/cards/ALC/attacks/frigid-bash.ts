import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const frigidBash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "k2c7wklzjm",
  slug: "frigid-bash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "k2c7wklzjm:face:default",
      catalogId: "k2c7wklzjm",
      name: "Frigid Bash",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SHIELD"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "This card costs 2 less to activate If you control a Shield item.\n\n[Class Bonus] On Hit: The hit object doesn't wake up during its controller's next wake up phase unless that player pays (2). (The optional cost is paid upon the resolution of this trigger.)",
      abilities: [
        {
          id: "k2c7wklzjm-a1",
          kind: "static",
          staticKind: "effects",
          text: "This card costs 2 less to activate If you control a Shield item.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ITEM"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SHIELD"],
                      },
                    ],
                  },
                },
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
          id: "k2c7wklzjm-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: The hit object doesn't wake up during its controller's next wake up phase unless that player pays (2). (The optional cost is paid upon the resolution of this trigger.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "hit-object",
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
            kind: "unless-paid",
            player: {
              controllerOf: "hit-object",
            },
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            otherwise: {
              kind: "rule-modification",
              mode: "forbid",
              action: "wake",
              subject: {
                kind: "bound",
                binding: "hit-object",
              },
              duration: {
                kind: "until-end-of-next-phase",
                phase: "wake-up",
                whose: {
                  controllerOf: "hit-object",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default frigidBash;
