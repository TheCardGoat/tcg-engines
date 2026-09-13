import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dominatingStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "svd53zc9p4",
  slug: "dominating-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "svd53zc9p4:face:default",
      catalogId: "svd53zc9p4",
      name: "Dominating Strike",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FIST"],
      },
      elements: ["WIND"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Vanitas Bonus] You may reveal three wind element cards from your memory rather than pay this card's reserve cost. (Apply this effect only if your champion is Vanitas.)\n\nWeapons can't be used for this attack.",
      abilities: [
        {
          id: "svd53zc9p4-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Vanitas Bonus] You may reveal three wind element cards from your memory rather than pay this card's reserve cost. (Apply this effect only if your champion is Vanitas.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Vanitas",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "reveal",
                player: "controller",
                from: "memory",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "svd53zc9p4-a2",
          kind: "card-resolution",
          text: "Weapons can't be used for this attack.",
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "use-weapon-for-attack",
            duration: {
              kind: "while-source-in-functional-zone",
            },
          },
        },
      ],
    },
  },
};

export default dominatingStrike;
