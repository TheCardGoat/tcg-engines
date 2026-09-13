import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blitzCharger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qxgqqotfxp",
  slug: "blitz-charger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qxgqqotfxp:face:default",
      catalogId: "qxgqqotfxp",
      name: "Blitz Charger",
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
        power: 3,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default blitzCharger;
