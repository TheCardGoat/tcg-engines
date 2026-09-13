import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const viridianProtectiveTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s3572j3oda",
  slug: "viridian-protective-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s3572j3oda:face:default",
      catalogId: "s3572j3oda",
      name: "Viridian Protective Trinket",
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
        "During your turn, water element cards your opponents activate cost 2 more to activate.",
      abilities: [
        {
          id: "s3572j3oda-a1",
          kind: "static",
          staticKind: "effects",
          text: "During your turn, water element cards your opponents activate cost 2 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "opponent",
              },
              filter: {
                kind: "element",
                oneOf: ["WATER"],
              },
              condition: {
                kind: "turn-player",
                player: "controller",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default viridianProtectiveTrinket;
