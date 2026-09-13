import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const swordSaintOfEventide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lve1my3486",
  slug: "sword-saint-of-eventide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lve1my3486:face:default",
      catalogId: "lve1my3486",
      name: "Sword Saint of Eventide",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Look at the top card of your deck. You may put it into your graveyard.\n\n[Class Bonus] As long as you have four or more water element cards in your graveyard, Sword Saint of Eventide gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.) ",
      abilities: [
        {
          id: "lve1my3486-a1",
          kind: "triggered",
          text: "On Enter: Look at the top card of your deck. You may put it into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "referenced-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  destination: {
                    zone: "graveyard",
                  },
                },
              },
            ],
          },
        },
        {
          id: "lve1my3486-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as you have four or more water element cards in your graveyard, Sword Saint of Eventide gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 4,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default swordSaintOfEventide;
