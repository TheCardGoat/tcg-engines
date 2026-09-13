import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const exsanguinatingWallop: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cicanyx695",
  slug: "exsanguinating-wallop",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cicanyx695:face:default",
      catalogId: "cicanyx695",
      name: "Exsanguinating Wallop",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 5,
      },
      rulesText: "[Class Bonus] On Attack: Recover 3.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "cicanyx695-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Recover 3.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
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
            kind: "recover",
            player: "controller",
            amount: 3,
          },
        },
        {
          id: "cicanyx695-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
      ],
    },
  },
};

export default exsanguinatingWallop;
