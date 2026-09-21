import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const proofOfLife: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mes4idoihs",
  slug: "proof-of-life",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mes4idoihs:face:default",
      catalogId: "mes4idoihs",
      name: "Proof of Life",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "The next time your champion would take damage this turn, double that damage.\n\n[Damage 40+] (2), Banish this card from your graveyard: Wake up your champion.",
      abilities: [
        {
          id: "mes4idoihs-a1",
          kind: "card-resolution",
          text: "The next time your champion would take damage this turn, double that damage.",
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            operation: {
              kind: "modify-amount",
              operation: "multiply",
              amount: 2,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
            },
          },
        },
        {
          id: "mes4idoihs-a2",
          kind: "activated",
          text: "[Damage 40+] (2), Banish this card from your graveyard: Wake up your champion.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 40,
                },
              },
            },
          ],
          effect: {
            kind: "wake",
            subject: {
              kind: "champion",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default proofOfLife;
