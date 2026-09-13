import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const brashDefender: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i1sh9r9rda",
  slug: "brash-defender",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i1sh9r9rda:face:default",
      catalogId: "i1sh9r9rda",
      name: "Brash Defender",
      cost: {
        kind: "reserve",
        amount: 4,
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
        life: 4,
      },
      rulesText:
        "[Level 1+] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion is level 1 or higher.)\n\nRetort 3 (As long as this ally is retaliating, it gets +3 POWER.)",
      abilities: [
        {
          id: "i1sh9r9rda-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Level 1+] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion is level 1 or higher.)",
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
                  right: 1,
                },
              },
            },
          ],
        },
        {
          id: "i1sh9r9rda-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Retort 3 (As long as this ally is retaliating, it gets +3 POWER.)",
          keyword: {
            name: "retort",
            value: 3,
          },
        },
      ],
    },
  },
};

export default brashDefender;
