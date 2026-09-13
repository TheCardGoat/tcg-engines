import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const generalAtArms: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9m72c8x9oh",
  slug: "general-at-arms",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9m72c8x9oh:face:default",
      catalogId: "9m72c8x9oh",
      name: "General at Arms",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Polearm attack cards you activate enter the intent with +2 power. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "9m72c8x9oh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Polearm attack cards you activate enter the intent with +2 power. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "replacement",
              event: {
                name: "card-activated",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["POLEARM"],
                      },
                    ],
                  },
                },
              },
              operation: {
                kind: "modify-characteristic",
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default generalAtArms;
