import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sadiBloodHarvester: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ugly4wiffe",
  slug: "sadi-blood-harvester",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ugly4wiffe:face:default",
      catalogId: "ugly4wiffe",
      name: "Sadi, Blood Harvester",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "(2): Return Sadi to its owner's hand. If you do, put a preparation counter on your champion.\n\n[Class Bonus] On Kill: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "ugly4wiffe-a1",
          kind: "activated",
          text: "(2): Return Sadi to its owner's hand. If you do, put a preparation counter on your champion.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                effect: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
                bindSucceededAs: "prior-effect-succeeded",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "prior-effect-succeeded",
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "ugly4wiffe-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
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
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default sadiBloodHarvester;
