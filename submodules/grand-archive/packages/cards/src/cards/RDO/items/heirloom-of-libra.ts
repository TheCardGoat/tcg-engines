import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heirloomOfLibra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MRiM1fnOWC",
  slug: "heirloom-of-libra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MRiM1fnOWC:face:default",
      catalogId: "MRiM1fnOWC",
      name: "Heirloom of Libra",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Banish Heirloom of Libra: Choose one— \n• Each champion you don’t control gets -5 level until end of turn.\n• Until end of turn, your opponents can’t glimpse.\n\n(3), Banish Heirloom of Libra: Draw a card into your memory.",
      abilities: [
        {
          id: "MRiM1fnOWC-a1",
          kind: "activated",
          text: "Banish Heirloom of Libra: Choose one—\n• Each champion you don’t control gets -5 level until end of turn.\n• Until end of turn, your opponents can’t glimpse.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            modes: [
              {
                id: "lower-level",
                text: "Each champion you don’t control gets -5 level until end of turn.",
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "each",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "type",
                        oneOf: ["CHAMPION"],
                      },
                    },
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "level",
                    operation: "subtract",
                    amount: 5,
                  },
                },
              },
              {
                id: "forbid-glimpse",
                text: "Until end of turn, your opponents can’t glimpse.",
                effect: {
                  kind: "rule-modification",
                  mode: "forbid",
                  action: "glimpse",
                  subject: {
                    kind: "player",
                    player: "each-opponent",
                  },
                  duration: {
                    kind: "this-turn",
                  },
                },
              },
            ],
          },
        },
        {
          id: "MRiM1fnOWC-a2",
          kind: "activated",
          text: "(3), Banish Heirloom of Libra: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default heirloomOfLibra;
