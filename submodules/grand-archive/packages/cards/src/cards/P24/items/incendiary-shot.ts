import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const incendiaryShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3qu7d6sopo",
  slug: "incendiary-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3qu7d6sopo:face:default",
      catalogId: "3qu7d6sopo",
      name: "Incendiary Shot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "REST: Load Incendiary Shot into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)\n\n[Class Bonus] On Hit: Deal 2 damage to the hit object.",
      abilities: [
        {
          id: "3qu7d6sopo-a1",
          kind: "activated",
          text: "REST: Load Incendiary Shot into target unloaded Gun weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "3qu7d6sopo-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Deal 2 damage to the hit object.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "event-recipient",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default incendiaryShot;
