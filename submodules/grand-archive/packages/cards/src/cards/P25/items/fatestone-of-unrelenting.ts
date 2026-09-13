import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatestoneOfUnrelenting: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o37qtuvlxa",
  slug: "fatestone-of-unrelenting",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "o37qtuvlxa:face:default",
      catalogId: "o37qtuvlxa",
      name: "Fatestone of Unrelenting",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nOn Enter: As a Spell, deal 1 damage to target unit.\n\n[Guo Jia Bonus] REST, Banish two fire element cards from your graveyard: Transform Fatestone of Unrelenting, then wake it up.",
      abilities: [
        {
          id: "o37qtuvlxa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "o37qtuvlxa-a2",
          kind: "triggered",
          text: "On Enter: As a Spell, deal 1 damage to target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 1,
            },
          },
        },
        {
          id: "o37qtuvlxa-a3",
          kind: "activated",
          text: "[Guo Jia Bonus] REST, Banish two fire element cards from your graveyard: Transform Fatestone of Unrelenting, then wake it up.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
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
                kind: "transform",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "wake",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "o37qtuvlxa:face:flip",
      catalogId: "0g1drhiwhn",
      name: "Cheetah of Bound Fury",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "CAT"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "On Hit: You may banish Cheetah of Bound Fury, then return it to the field under its owner's control. (It enters the field as Fatestone of Unrelenting.)",
      abilities: [
        {
          id: "0g1drhiwhn-a1",
          kind: "triggered",
          text: "On Hit: You may banish Cheetah of Bound Fury, then return it to the field under its owner's control. (It enters the field as Fatestone of Unrelenting.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                  bindResultAs: "banished-cheetah",
                },
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "banished-cheetah",
                  },
                  from: "banishment",
                  destination: {
                    zone: "field",
                    controller: {
                      ownerOf: "banished-cheetah",
                    },
                    face: "default",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default fatestoneOfUnrelenting;
