import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const extinguishingSynchron: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Tx8noEw78s",
  slug: "extinguishing-synchron",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Tx8noEw78s:face:default",
      catalogId: "Tx8noEw78s",
      name: "Extinguishing Synchron",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "BAUBLE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your champion is dealt non-combat damage by a fire element source, put a refinement counter on Extinguishing Synchron.\n\nSacrifice Extinguishing Synchron: Recover 2+X, where X is the amount of refinement counters that was on Extinguishing Synchron.",
      abilities: [
        {
          id: "Tx8noEw78s-a1",
          kind: "triggered",
          text: "Whenever your champion is dealt non-combat damage by a fire element source, put a refinement counter on Extinguishing Synchron.",
          trigger: {
            kind: "event",
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
              combatDamage: false,
              subject: {
                kind: "event-object",
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "Tx8noEw78s-a2",
          kind: "activated",
          text: "Sacrifice Extinguishing Synchron: Recover 2+X, where X is the amount of refinement counters that was on Extinguishing Synchron.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                2,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default extinguishingSynchron;
