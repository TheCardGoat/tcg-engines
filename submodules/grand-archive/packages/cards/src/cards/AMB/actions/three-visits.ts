import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const threeVisits: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w7o3agvvnc",
  slug: "three-visits",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w7o3agvvnc:face:default",
      catalogId: "w7o3agvvnc",
      name: "Three Visits",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SKILL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, rest your champion.\n\n[Class Bonus] You may activate this card from your graveyard. If you do, banish it as it resolves.\n\n[Class Bonus] You may activate this card from your banishment. If you do, put it on the bottom of your deck as it resolves.\n\nGlimpse 2 and recover 2.",
      abilities: [
        {
          id: "w7o3agvvnc-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, rest your champion.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "rest",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "w7o3agvvnc-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] You may activate this card from your graveyard. If you do, banish it as it resolves.",
          functionalZones: ["graveyard"],
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
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "graveyard",
              activationResult: {
                afterResolution: {
                  kind: "banish-object",
                  subject: {
                    kind: "source",
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "w7o3agvvnc-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] You may activate this card from your banishment. If you do, put it on the bottom of your deck as it resolves.",
          functionalZones: ["banishment"],
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
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "banishment",
              activationResult: {
                afterResolution: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "main-deck",
                    placement: {
                      kind: "bottom",
                    },
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "w7o3agvvnc-a4",
          kind: "card-resolution",
          text: "Glimpse 2 and recover 2.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 2,
              },
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default threeVisits;
