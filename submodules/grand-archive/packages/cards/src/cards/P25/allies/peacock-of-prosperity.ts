import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const peacockOfProsperity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cl1mvb9q96",
  slug: "peacock-of-prosperity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cl1mvb9q96:face:default",
      catalogId: "cl1mvb9q96",
      name: "Peacock of Prosperity",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "BIRD"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, you may put a card named Peacock of Prosperity from your memory onto the field. If you do, draw a card into your memory.",
      abilities: [
        {
          id: "cl1mvb9q96-a1",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, you may put a card named Peacock of Prosperity from your memory onto the field. If you do, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "memory",
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
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "deployed-peacock",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "name",
                    value: "Peacock of Prosperity",
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "deployed-peacock",
                    },
                    from: "memory",
                    destination: {
                      zone: "field",
                    },
                  },
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                    to: "memory",
                  },
                ],
              },
            },
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default peacockOfProsperity;
