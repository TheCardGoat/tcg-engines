import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tendTheLand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Rgg4dJYxnl",
  slug: "tend-the-land",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Rgg4dJYxnl:face:default",
      catalogId: "Rgg4dJYxnl",
      name: "Tend the Land",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nGather, then draw a card. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "Rgg4dJYxnl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        {
          id: "Rgg4dJYxnl-a2",
          kind: "card-resolution",
          text: "Gather, then draw a card. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "gather",
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default tendTheLand;
