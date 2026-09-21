import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fulguriteCoordinator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7aZwqrfbzO",
  slug: "fulgurite-coordinator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7aZwqrfbzO:face:default",
      catalogId: "7aZwqrfbzO",
      name: "Fulgurite Coordinator",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Fulgurite Coordinator enters the field with a static counter on it.\n\n[Element Bonus] (1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
      abilities: [
        {
          id: "7aZwqrfbzO-a1",
          kind: "static",
          staticKind: "effects",
          text: "Fulgurite Coordinator enters the field with a static counter on it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "add-object-counters",
                counters: [
                  {
                    counter: "static",
                    amount: 1,
                  },
                ],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "7aZwqrfbzO-a2",
          kind: "activated",
          text: "[Element Bonus] (1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 1,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
              },
            },
          ],
          restrictions: [
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "static",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default fulguriteCoordinator;
