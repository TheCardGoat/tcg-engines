import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lightweaversAssault: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zxB4tzy9iy",
  slug: "lightweavers-assault",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zxB4tzy9iy:face:default",
      catalogId: "zxB4tzy9iy",
      name: "Lightweaver's Assault",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["LUXEM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Reveal all cards in your memory. Choose any amount of units and deal damage equal to the amount of cards revealed this way split among them.\n\n[Class Bonus] [Element Bonus] Whenever you reveal Lightweaver's Assault from your memory, choose a unit and deal 2 damage to it.",
      abilities: [
        {
          id: "zxB4tzy9iy-a1",
          kind: "card-resolution",
          text: "Reveal all cards in your memory. Choose any amount of units and deal damage equal to the amount of cards revealed this way split among them.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "reveal",
                player: "controller",
                selection: {
                  id: "revealed-memory",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
              },
              {
                kind: "distribute",
                amount: {
                  kind: "count",
                  collection: {
                    binding: "revealed-memory",
                  },
                },
                among: {
                  id: "damage-recipients",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
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
                payload: {
                  kind: "damage",
                  source: {
                    kind: "source",
                  },
                },
              },
            ],
          },
        },
        {
          id: "zxB4tzy9iy-a2",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal Lightweaver's Assault from your memory, choose a unit and deal 2 damage to it.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
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
            kind: "choose",
            selection: {
              id: "target-1",
              kind: "choice",
              declared: "resolution",
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
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
            },
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default lightweaversAssault;
