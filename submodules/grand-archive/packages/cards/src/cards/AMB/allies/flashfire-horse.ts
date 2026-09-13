import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flashfireHorse: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aljx2ru1w3",
  slug: "flashfire-horse",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aljx2ru1w3:face:default",
      catalogId: "aljx2ru1w3",
      name: "Flashfire Horse",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "Fast Activation (You may activate this card at fast speed.)",
      abilities: [
        {
          id: "aljx2ru1w3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
        },
      ],
    },
  },
};

export default flashfireHorse;
