import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const marksmansCharm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zqw6ms798w",
  slug: "marksmans-charm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zqw6ms798w:face:default",
      catalogId: "zqw6ms798w",
      name: "Marksman's Charm",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Marksman's Charm: Target unit gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
      abilities: [
        {
          id: "zqw6ms798w-a1",
          kind: "activated",
          text: "Banish Marksman's Charm: Target unit gains true sight until end of turn. (Units with true sight can attack units with stealth.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
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

export default marksmansCharm;
