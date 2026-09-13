import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automatonDrone: GrandArchiveCard<
  GrandArchiveAbilityDefinition,
  "token-representation"
> = {
  canonicalId: "mu6gvnta6q",
  slug: "automaton-drone",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "mu6gvnta6q:face:default",
      catalogId: "mu6gvnta6q",
      name: "Automaton Drone",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default automatonDrone;
