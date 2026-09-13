import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const indiscriminateGyre: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "byyw53xbld",
  slug: "indiscriminate-gyre",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "byyw53xbld:face:default",
      catalogId: "byyw53xbld",
      name: "Indiscriminate Gyre",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Deal 2 damage to all allies. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "byyw53xbld-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Deal 2 damage to all allies. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default indiscriminateGyre;
