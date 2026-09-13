import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const primaMateria: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vt9y597fqr",
  slug: "prima-materia",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vt9y597fqr:face:default",
      catalogId: "vt9y597fqr",
      name: "Prima Materia",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Arisanna Bonus] Brew — Four Herbs with different names\n\nREST: Draw a card into your memory. If Prima Materia was brewed, the next time an astra element source you control would deal damage to one or more units this turn, it deals that much damage plus 3 to those units instead.",
      abilities: [
        {
          id: "vt9y597fqr-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Arisanna Bonus] Brew — Four Herbs with different names",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 4,
              },
            ],
            nameConstraint: "different",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
        },
        {
          id: "vt9y597fqr-a2",
          kind: "activated",
          text: "REST: Draw a card into your memory. If Prima Materia was brewed, the next time an astra element source you control would deal damage to one or more units this turn, it deals that much damage plus 3 to those units instead.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
                to: "memory",
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "brewed",
                },
                then: {
                  kind: "replacement",
                  event: {
                    name: "damage-dealt",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["ASTRA"],
                      },
                    },
                  },
                  operation: {
                    kind: "modify-amount",
                    operation: "add",
                    amount: 3,
                  },
                  duration: {
                    kind: "for-next-event",
                    event: "damage-dealt",
                    expires: {
                      kind: "this-turn",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default primaMateria;
