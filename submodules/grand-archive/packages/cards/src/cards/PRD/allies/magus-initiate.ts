import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const magusInitiate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fZ08zyFIlz",
  slug: "magus-initiate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fZ08zyFIlz:face:default",
      catalogId: "fZ08zyFIlz",
      name: "Magus Initiate",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Empower 2. (Apply this effect only if your champion's class matches this card's class.)\n\nOn Death: Draw a card.",
      abilities: [
        {
          id: "fZ08zyFIlz-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Empower 2. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
        {
          id: "fZ08zyFIlz-a2",
          kind: "triggered",
          text: "On Death: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default magusInitiate;
