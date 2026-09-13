import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfSparks: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5pw07bh5wf",
  slug: "fractal-of-sparks",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5pw07bh5wf:face:default",
      catalogId: "5pw07bh5wf",
      name: "Fractal of Sparks",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\n[Class Bonus] REST: Deal 1 damage to target champion. (Activate this ability only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "5pw07bh5wf-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "5pw07bh5wf-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Deal 1 damage to target champion. (Activate this ability only if your champion’s class matches this card’s class.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
      ],
    },
  },
};

export default fractalOfSparks;
