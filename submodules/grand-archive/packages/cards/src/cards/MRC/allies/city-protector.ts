import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cityProtector: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bqjdmthh88",
  slug: "city-protector",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bqjdmthh88:face:default",
      catalogId: "bqjdmthh88",
      name: "City Protector",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\nOn Foster: Summon an Automaton Drone token.",
      abilities: [
        {
          id: "bqjdmthh88-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "bqjdmthh88-a2",
          kind: "triggered",
          text: "On Foster: Summon an Automaton Drone token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-fostered",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default cityProtector;
