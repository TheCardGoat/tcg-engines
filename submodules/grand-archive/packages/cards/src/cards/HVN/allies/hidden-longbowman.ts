import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hiddenLongbowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bx4k3akqx7",
  slug: "hidden-longbowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bx4k3akqx7:face:default",
      catalogId: "bx4k3akqx7",
      name: "Hidden Longbowman",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nHidden Longbowman has stealth as long as it's distant. (This unit with stealth can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "bx4k3akqx7-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "bx4k3akqx7-a2",
          kind: "static",
          staticKind: "effects",
          text: "Hidden Longbowman has stealth as long as it's distant. (This unit with stealth can't be targeted by attacks unless permitted by true sight.)",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "distant",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "stealth",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default hiddenLongbowman;
