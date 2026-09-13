import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cloakedExecutioner: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "itwys9kf4r",
  slug: "cloaked-executioner",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "itwys9kf4r:face:default",
      catalogId: "itwys9kf4r",
      name: "Cloaked Executioner",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nAmbush (This ally may retaliate against attackers while not defending.)",
      abilities: [
        {
          id: "itwys9kf4r-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        },
        {
          id: "itwys9kf4r-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ambush (This ally may retaliate against attackers while not defending.)",
          keyword: {
            name: "ambush",
          },
        },
      ],
    },
  },
};

export default cloakedExecutioner;
