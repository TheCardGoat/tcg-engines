import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reactivateDrone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xWqduqhMNp",
  slug: "reactivate-drone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xWqduqhMNp:face:default",
      catalogId: "xWqduqhMNp",
      name: "Reactivate Drone",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NEOS"],
      speed: "fast",
      stats: {},
      rulesText:
        "Summon an Automaton Drone token rested with a buff counter on it.\n\nEphemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "xWqduqhMNp-a1",
          kind: "card-resolution",
          text: "Summon an Automaton Drone token rested with a buff counter on it.",
          effect: {
            kind: "summon",
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            entersWithStates: ["rested"],
            entersWithCounters: [
              {
                counter: "buff",
                amount: 1,
              },
            ],
          },
        },
        {
          id: "xWqduqhMNp-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default reactivateDrone;
