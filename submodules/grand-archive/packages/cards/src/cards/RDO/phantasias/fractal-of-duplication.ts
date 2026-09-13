import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfDuplication: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1f3sLuuCtV",
  slug: "fractal-of-duplication",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1f3sLuuCtV:face:default",
      catalogId: "1f3sLuuCtV",
      name: "Fractal of Duplication",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "Whenever Fractal of Duplication becomes rested, summon a token copy of it rested.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "1f3sLuuCtV-a1",
          kind: "triggered",
          text: "Whenever Fractal of Duplication becomes rested, summon a token copy of it rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "rested",
              to: true,
            },
          },
          effect: {
            kind: "summon",
            copyOf: {
              kind: "event-subject",
            },
            controller: "controller",
            entersWithStates: ["rested"],
          },
        },
        {
          id: "1f3sLuuCtV-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default fractalOfDuplication;
