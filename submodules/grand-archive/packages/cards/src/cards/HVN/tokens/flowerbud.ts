import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flowerbud: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "yn78t73w1p",
  slug: "flowerbud",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "yn78t73w1p:face:default",
      catalogId: "yn78t73w1p",
      name: "Flowerbud",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWERBUD"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

export default flowerbud;
