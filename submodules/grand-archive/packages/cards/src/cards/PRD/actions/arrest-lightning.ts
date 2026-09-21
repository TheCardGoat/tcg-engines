import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arrestLightning: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9e3B8EHQak",
  slug: "arrest-lightning",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9e3B8EHQak:face:default",
      catalogId: "9e3B8EHQak",
      name: "Arrest Lightning",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "REACTION"],
      },
      elements: ["ARCANE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next X damage that would be dealt to target unit this turn, where X is the amount of static counters on that unit. (X is calculated only as this card resolves.)\n\n[Class Bonus] [Element Bonus] (1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
      abilities: [
        {
          id: "9e3B8EHQak-a1",
          kind: "card-resolution",
          text: "Prevent the next X damage that would be dealt to target unit this turn, where X is the amount of static counters on that unit. (X is calculated only as this card resolves.)",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "static",
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "variable",
                symbol: "X",
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "9e3B8EHQak-a2",
          kind: "activated",
          text: "[Class Bonus] [Element Bonus] (1), Banish this card from your graveyard: Put a static counter on target arcane element object you control and each object linked to it.",
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

export default arrestLightning;
