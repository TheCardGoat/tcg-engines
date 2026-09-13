import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aurousteelGreatsword: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "hkurfp66pv",
  slug: "aurousteel-greatsword",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "hkurfp66pv:face:default",
      catalogId: "hkurfp66pv",
      name: "Aurousteel Greatsword",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NEOS"],
      stats: {
        power: 3,
        durability: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default aurousteelGreatsword;
