import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const noviceMechanist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "22tk3ir1o0",
  slug: "novice-mechanist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "22tk3ir1o0:face:default",
      catalogId: "22tk3ir1o0",
      name: "Novice Mechanist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\nOn Foster: Summon an Automaton Drone token.",
      abilities: [
        {
          id: "22tk3ir1o0-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "22tk3ir1o0-a2",
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

export default noviceMechanist;
