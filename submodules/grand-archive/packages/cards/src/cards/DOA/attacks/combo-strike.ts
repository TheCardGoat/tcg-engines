import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const comboStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zcVjsVRBV8",
  slug: "combo-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zcVjsVRBV8:face:default",
      catalogId: "zcVjsVRBV8",
      name: "Combo Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] [Level 2+] On Kill: Wake up your champion. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "zcVjsVRBV8-a1",
          kind: "triggered",
          text: "[Class Bonus] [Level 2+] On Kill: Wake up your champion. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
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
          effect: {
            kind: "wake",
            subject: {
              kind: "champion",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default comboStrike;
