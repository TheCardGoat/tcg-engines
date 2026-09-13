import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sageProtection: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fqsa372jii",
  slug: "sage-protection",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fqsa372jii:face:default",
      catalogId: "fqsa372jii",
      name: "Sage Protection",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Up to three target allies get +1 LIFE until end of turn.\n\n[Class Bonus] Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "fqsa372jii-a1",
          kind: "card-resolution",
          text: "Up to three target allies get +1 LIFE until end of turn.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "life",
              operation: "add",
              amount: 1,
            },
          },
        },
        {
          id: "fqsa372jii-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "enlighten",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default sageProtection;
