import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const loneGunslinger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "eanl1gxrpx",
  slug: "lone-gunslinger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "eanl1gxrpx:face:default",
      catalogId: "eanl1gxrpx",
      name: "Lone Gunslinger",
      cost: {
        kind: "reserve",
        amount: 1,
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
        life: 1,
      },
      rulesText:
        "Ranged 1 (As long as this unit is distant, its attacks get +1 POWER.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "eanl1gxrpx-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 1 (As long as this unit is distant, its attacks get +1 POWER.)",
          keyword: {
            name: "ranged",
            value: 1,
          },
        },
        {
          id: "eanl1gxrpx-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default loneGunslinger;
