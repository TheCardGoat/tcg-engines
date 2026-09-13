import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harvestHerbs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zadf9q1wl8",
  slug: "harvest-herbs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zadf9q1wl8:face:default",
      catalogId: "zadf9q1wl8",
      name: "Harvest Herbs",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "zadf9q1wl8-a1",
          kind: "card-resolution",
          text: "Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          effect: {
            kind: "keyword-action",
            action: "gather",
          },
        },
        {
          id: "zadf9q1wl8-a2",
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

export default harvestHerbs;
