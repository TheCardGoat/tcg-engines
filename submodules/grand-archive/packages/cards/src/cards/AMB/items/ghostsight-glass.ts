import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ghostsightGlass: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cc0jmpmman",
  slug: "ghostsight-glass",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cc0jmpmman:face:default",
      catalogId: "cc0jmpmman",
      name: "Ghostsight Glass",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "(3), REST: Target unit gains true sight until end of turn. Activate this ability only at slow speed. (Units with true sight can attack units with stealth.)",
      abilities: [
        {
          id: "cc0jmpmman-a1",
          kind: "activated",
          text: "(3), REST: Target unit gains true sight until end of turn. Activate this ability only at slow speed. (Units with true sight can attack units with stealth.)",
          activation: "ability",
          speed: "slow",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
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
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "true-sight",
              },
            },
          },
        },
      ],
    },
  },
};

export default ghostsightGlass;
