import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cheapSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "a40EMvoqYX",
  slug: "cheap-sword",
  definitionKind: "token-representation",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "a40EMvoqYX:face:default",
      catalogId: "a40EMvoqYX",
      name: "Cheap Sword",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default cheapSword;
