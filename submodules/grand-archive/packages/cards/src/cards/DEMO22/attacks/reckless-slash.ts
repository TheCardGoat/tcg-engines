import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const recklessSlash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "NaGi9nBjJA",
  slug: "reckless-slash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "NaGi9nBjJA:face:default",
      catalogId: "NaGi9nBjJA",
      name: "Reckless Slash",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default recklessSlash;
