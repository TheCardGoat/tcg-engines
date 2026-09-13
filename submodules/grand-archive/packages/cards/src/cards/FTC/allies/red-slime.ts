import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const redSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mttsvbgl6f",
  slug: "red-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mttsvbgl6f:face:default",
      catalogId: "mttsvbgl6f",
      name: "Red Slime",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "Pride 3 (This ally won't obey you unless your champion is level 3 or higher.)\n\n[Class Bonus] On Death: Deal damage to all allies equal to Red Slime's power. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "mttsvbgl6f-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 3 (This ally won't obey you unless your champion is level 3 or higher.)",
          keyword: {
            name: "pride",
            value: 3,
          },
        },
        {
          id: "mttsvbgl6f-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Deal damage to all allies equal to Red Slime's power. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
              kind: "event-source",
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
            amount: {
              kind: "property",
              subject: {
                kind: "event-source",
              },
              property: "power",
              basis: "last-known",
              missing: "zero",
            },
          },
        },
      ],
    },
  },
};

export default redSlime;
