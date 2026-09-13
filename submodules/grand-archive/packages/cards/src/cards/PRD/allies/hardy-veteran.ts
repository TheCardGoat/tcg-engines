import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hardyVeteran: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VmCVxy9J9J",
  slug: "hardy-veteran",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VmCVxy9J9J:face:default",
      catalogId: "VmCVxy9J9J",
      name: "Hardy Veteran",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\n[Class Bonus] As long as you control a weapon, Hardy Veteran has retort 3. (As long as an ally with retort 3 is retaliating, it gets +3POWER.)",
      abilities: [
        {
          id: "VmCVxy9J9J-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "VmCVxy9J9J-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you control a weapon, Hardy Veteran has retort 3. (As long as an ally with retort 3 is retaliating, it gets +3POWER.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["WEAPON"],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "retort",
                  value: 3,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default hardyVeteran;
