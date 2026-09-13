import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tyrannicalDenigration: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "OjOcXBiO0b",
  slug: "tyrannical-denigration",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "OjOcXBiO0b:face:default",
      catalogId: "OjOcXBiO0b",
      name: "Tyrannical Denigration",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["EXALTED", "FIRE"],
      stats: {
        power: 4,
      },
      rulesText:
        "Kindle 7 (You may banish up to seven fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)\n\n[Class Bonus] Tyrannical Denigration gets +4 POWER and can't be retaliated.",
      abilities: [
        {
          id: "OjOcXBiO0b-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 7 (You may banish up to seven fire element cards from your graveyard as you activate this card. Each one pays for (1) of this card’s cost.)",
          keyword: {
            name: "kindle",
            value: 7,
          },
        },
        {
          id: "OjOcXBiO0b-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Tyrannical Denigration gets +4 POWER and can't be retaliated.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 4,
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              against: {
                kind: "source",
              },
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

export default tyrannicalDenigration;
