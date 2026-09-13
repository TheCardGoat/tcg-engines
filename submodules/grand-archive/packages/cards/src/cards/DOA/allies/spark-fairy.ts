import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sparkFairy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FWnxKjSeB1",
  slug: "spark-fairy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FWnxKjSeB1:face:default",
      catalogId: "FWnxKjSeB1",
      name: "Spark Fairy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FAIRY"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nOn Enter: Target non-champion object gains “At the beginning of your recollection phase, deal 1 unpreventable damage to your champion” for as long as you control Spark Fairy.",
      abilities: [
        {
          id: "FWnxKjSeB1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "FWnxKjSeB1-a2",
          kind: "triggered",
          text: "On Enter: Target non-champion object gains “At the beginning of your recollection phase, deal 1 unpreventable damage to your champion” for as long as you control Spark Fairy.",
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
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            condition: {
              kind: "controls-subject",
              player: "controller",
              subject: {
                kind: "source",
              },
            },
            duration: {
              kind: "while-source-on-field",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-n2mtlo-a1",
                kind: "triggered",
                text: "At the beginning of your recollection phase, deal 1 unpreventable damage to your champion",
                trigger: {
                  kind: "event",
                  event: {
                    name: "phase-begins",
                    phase: "recollection",
                    actor: "controller",
                  },
                },
                effect: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 1,
                  preventable: false,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default sparkFairy;
