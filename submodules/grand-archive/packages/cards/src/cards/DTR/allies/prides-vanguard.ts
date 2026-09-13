import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pridesVanguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9mjhngb8qe",
  slug: "prides-vanguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9mjhngb8qe:face:default",
      catalogId: "9mjhngb8qe",
      name: "Pride's Vanguard",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANIMAL", "HUMAN", "LION"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ambush (This ally may retaliate against attackers while not defending.)\n\nRetort 2 (As long as this ally is retaliating, it gets +2POWER.)",
      abilities: [
        {
          id: "9mjhngb8qe-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush (This ally may retaliate against attackers while not defending.)",
          keyword: {
            name: "ambush",
          },
        },
        {
          id: "9mjhngb8qe-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 2 (As long as this ally is retaliating, it gets +2POWER.)",
          keyword: {
            name: "retort",
            value: 2,
          },
        },
      ],
    },
  },
};

export default pridesVanguard;
