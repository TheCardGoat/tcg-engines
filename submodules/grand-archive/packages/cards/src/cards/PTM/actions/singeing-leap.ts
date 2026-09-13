import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const singeingLeap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YFCfIOwNQ5",
  slug: "singeing-leap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YFCfIOwNQ5:face:default",
      catalogId: "YFCfIOwNQ5",
      name: "Singeing Leap",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to your champion. Then your champion becomes distant.\n\n[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "YFCfIOwNQ5-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to your champion. Then your champion becomes distant.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 1,
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "distant",
                value: true,
              },
            ],
          },
        },
        {
          id: "YFCfIOwNQ5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
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
        },
      ],
    },
  },
};

export default singeingLeap;
