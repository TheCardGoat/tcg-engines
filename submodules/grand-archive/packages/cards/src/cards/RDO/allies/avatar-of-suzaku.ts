import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const avatarOfSuzaku: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jjGLZKfRn5",
  slug: "avatar-of-suzaku",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jjGLZKfRn5:face:default",
      catalogId: "jjGLZKfRn5",
      name: "Avatar of Suzaku",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "PHOENIX", "AVATAR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "[Guo Jia Bonus] While paying for this card’s reserve cost, you may remove up to two quest counters from your champion. Each counter removed this way pays for 1 of that cost.\n\n[Guo Jia Bonus] (2), Sacrifice Avatar of Suzaku: Put two quest counters on your champion. Then you may put a card named Fabled Ruby Fatestone from your material deck or banishment onto the field.",
      abilities: [
        {
          id: "jjGLZKfRn5-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Guo Jia Bonus] While paying for this card’s reserve cost, you may remove up to two quest counters from your champion. Each counter removed this way pays for 1 of that cost.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-remove-counters",
                player: "controller",
                objectFilter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                counter: {
                  named: "quest",
                },
                count: {
                  kind: "up-to",
                  amount: 2,
                },
              },
              amount: 1,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "jjGLZKfRn5-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (2), Sacrifice Avatar of Suzaku: Put two quest counters on your champion. Then you may put a card named Fabled Ruby Fatestone from your material deck or banishment onto the field.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "quest",
                },
                amount: 2,
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "chosen-multi-zone-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      zones: ["material-deck", "banishment"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "name",
                        value: "Fabled Ruby Fatestone",
                      },
                    },
                  },
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "chosen-multi-zone-card",
                    },
                    destination: {
                      zone: "field",
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

export default avatarOfSuzaku;
