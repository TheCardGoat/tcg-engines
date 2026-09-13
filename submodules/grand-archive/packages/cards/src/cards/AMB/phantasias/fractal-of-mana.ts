import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfMana: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "szeb8zzj86",
  slug: "fractal-of-mana",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "szeb8zzj86:face:default",
      catalogId: "szeb8zzj86",
      name: "Fractal of Mana",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "FRACTAL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\n[Class Bonus] REST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.)",
      abilities: [
        {
          id: "szeb8zzj86-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "szeb8zzj86-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Empower 1. (The next Spell card you activate this turn activates and resolves as if your champion got +1 level.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
          effect: {
            kind: "keyword-action",
            action: "empower",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default fractalOfMana;
