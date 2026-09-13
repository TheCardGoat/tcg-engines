import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unrelentingWarden: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "icvkegsdve",
  slug: "unrelenting-warden",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "icvkegsdve:face:default",
      catalogId: "icvkegsdve",
      name: "Unrelenting Warden",
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
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Taunt (While awake, this ally must be targeted before other units you control during your opponent's attack declarations if able.)\n\n[Level 2+] Vigor (This unit wakes up at the beginning of your end phase.)",
      abilities: [
        {
          id: "icvkegsdve-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Taunt (While awake, this ally must be targeted before other units you control during your opponent's attack declarations if able.)",
          keyword: {
            name: "taunt",
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
          id: "icvkegsdve-a2",
          kind: "triggered",
          intrinsic: true,
          text: "[Level 2+] Vigor (This unit wakes up at the beginning of your end phase.)",
          keyword: {
            name: "vigor",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default unrelentingWarden;
