import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lostBeing: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "duzpl7mqXl",
  slug: "lost-being",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "duzpl7mqXl:face:default",
      catalogId: "duzpl7mqXl",
      name: "Lost Being",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default lostBeing;
