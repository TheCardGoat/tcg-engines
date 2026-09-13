import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nurtureCrops: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mdk0xhi5jn",
  slug: "nurture-crops",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mdk0xhi5jn:face:default",
      catalogId: "mdk0xhi5jn",
      name: "Nurture Crops",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "Glimpse 2, then gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "mdk0xhi5jn-a1",
          kind: "card-resolution",
          text: "Glimpse 2, then gather twice. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "repeat",
                count: 2,
                effect: {
                  kind: "keyword-action",
                  action: "gather",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default nurtureCrops;
