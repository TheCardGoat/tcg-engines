import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const convokingSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b1w1mvu68a",
  slug: "convoking-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b1w1mvu68a:face:default",
      catalogId: "b1w1mvu68a",
      name: "Convoking Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["NEOS"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Pride 3\n\n[Class Bonus] At the beginning of your recollection phase, summon a copy of Convoking Slime rested. (Counters on this ally are not copied.)",
      abilities: [
        {
          id: "b1w1mvu68a-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "b1w1mvu68a-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, summon a copy of Convoking Slime rested. (Counters on this ally are not copied.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "summon",
            copyOf: {
              kind: "source",
            },
            controller: "controller",
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default convokingSlime;
