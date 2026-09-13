import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poisedStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mj3WSrghUH",
  slug: "poised-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mj3WSrghUH:face:default",
      catalogId: "mj3WSrghUH",
      name: "Poised Strike",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
      },
      rulesText:
        "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)\n\n[Class Bonus] On Hit: If Poised Strike was prepared, wake up your champion. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "mj3WSrghUH-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1 (You may remove a preparation counter from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 1,
          },
        },
        {
          id: "mj3WSrghUH-a2",
          kind: "triggered",
          text: "[Class Bonus] On Hit: If Poised Strike was prepared, wake up your champion. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
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
            kind: "conditional",
            condition: {
              kind: "activation-state",
              state: "prepared",
            },
            then: {
              kind: "wake",
              subject: {
                kind: "champion",
                player: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default poisedStrike;
