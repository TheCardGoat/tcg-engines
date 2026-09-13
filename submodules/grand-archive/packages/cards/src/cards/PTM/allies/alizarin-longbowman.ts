import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const alizarinLongbowman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "inQV2nZfdJ",
  slug: "alizarin-longbowman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "inQV2nZfdJ:face:default",
      catalogId: "inQV2nZfdJ",
      name: "Alizarin Longbowman",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["EXALTED", "FIRE"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\n[Class Bonus] Ranged 3\n\n[Class Bonus] Whenever Alizarin Longbowman becomes distant, you may have each player draw a card.",
      abilities: [
        {
          id: "inQV2nZfdJ-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "inQV2nZfdJ-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Ranged 3",
          keyword: {
            name: "ranged",
            value: 3,
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
          id: "inQV2nZfdJ-a3",
          kind: "triggered",
          text: "[Class Bonus] Whenever Alizarin Longbowman becomes distant, you may have each player draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "source",
              },
              state: "distant",
              to: true,
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "draw",
              player: "each-player",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default alizarinLongbowman;
