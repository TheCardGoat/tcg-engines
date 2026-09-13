import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vampiricSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "597fqr67du",
  slug: "vampiric-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "597fqr67du:face:default",
      catalogId: "597fqr67du",
      name: "Vampiric Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Pride 3\n\n[Class Bonus] On Hit: Recover X, where X is the amount of damage dealt by this hit.",
      abilities: [
        {
          id: "597fqr67du-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "597fqr67du-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Recover X, where X is the amount of damage dealt by this hit.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "event-amount",
              },
            },
          ],
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
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default vampiricSlime;
