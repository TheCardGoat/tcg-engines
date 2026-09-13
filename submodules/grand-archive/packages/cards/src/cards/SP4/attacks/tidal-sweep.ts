import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidalSweep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "GuDKuPKNgh",
  slug: "tidal-sweep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "GuDKuPKNgh:face:default",
      catalogId: "GuDKuPKNgh",
      name: "Tidal Sweep",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
      },
      rulesText:
        "Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "GuDKuPKNgh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)",
          keyword: {
            name: "cleave",
          },
        },
        {
          id: "GuDKuPKNgh-a2",
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

export default tidalSweep;
