import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cellForging: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pufooz13xf",
  slug: "cell-forging",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pufooz13xf:face:default",
      catalogId: "pufooz13xf",
      name: "Cell Forging",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CRAFT"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Choose one—\n• Put two durability counters on target weapon.\n• Summon a Powercell token.",
      abilities: [
        {
          id: "pufooz13xf-a1",
          kind: "card-resolution",
          text: "Choose one—\n• Put two durability counters on target weapon.\n• Summon a Powercell token.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "mode-1",
                text: "Put two durability counters on target weapon.",
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
                        oneOf: ["WEAPON"],
                      },
                    },
                  },
                ],
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "durability",
                  amount: 2,
                },
              },
              {
                id: "mode-2",
                text: "Summon a Powercell token",
                effect: {
                  kind: "summon",
                  object: "Powercell",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default cellForging;
