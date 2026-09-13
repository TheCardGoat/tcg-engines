import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sliceAndDice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3jg01o26b4",
  slug: "slice-and-dice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3jg01o26b4:face:default",
      catalogId: "3jg01o26b4",
      name: "Slice and Dice",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "Prepare 3\n\nOn Hit: If Slice and Dice was prepared, you may have the attacker declare an additional attack. If you do, create a copy of Slice and Dice in that attacker's intent except it isn't prepared and it gets +3 POWER.",
      abilities: [
        {
          id: "3jg01o26b4-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 3",
          keyword: {
            name: "prepare",
            value: 3,
          },
        },
        {
          id: "3jg01o26b4-a2",
          kind: "triggered",
          text: "On Hit: If Slice and Dice was prepared, you may have the attacker declare an additional attack. If you do, create a copy of Slice and Dice in that attacker's intent except it isn't prepared and it gets +3 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          interveningCondition: {
            kind: "object-state",
            subject: {
              kind: "source",
            },
            state: "prepared",
            basis: "last-known",
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "declare-attack",
              attacker: {
                kind: "event-attacker",
              },
              additional: true,
              ifDeclared: {
                kind: "sequence",
                effects: [
                  {
                    kind: "copy",
                    subject: {
                      kind: "source",
                    },
                    copy: "object",
                    bindResultAs: "slice-copy",
                  },
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "slice-copy",
                    },
                    destination: {
                      zone: "intent",
                      host: {
                        kind: "event-attacker",
                      },
                    },
                  },
                  {
                    kind: "set-object-state",
                    subject: {
                      kind: "bound",
                      binding: "slice-copy",
                    },
                    state: "prepared",
                    value: false,
                  },
                  {
                    kind: "continuous",
                    subjects: {
                      kind: "bound",
                      binding: "slice-copy",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "permanent",
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
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default sliceAndDice;
