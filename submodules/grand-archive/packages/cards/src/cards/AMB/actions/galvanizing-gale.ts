import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const galvanizingGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f00cEmu6Ql",
  slug: "galvanizing-gale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f00cEmu6Ql:face:default",
      catalogId: "f00cEmu6Ql",
      name: "Galvanizing Gale",
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
      speed: "slow",
      stats: {},
      rulesText:
        "Target ally's next attack this turn gets +3 POWER. If Galvanizing Gale was empowered, draw a card into your memory.",
      abilities: [
        {
          id: "f00cEmu6Ql-a1",
          kind: "card-resolution",
          text: "Target ally's next attack this turn gets +3 POWER. If Galvanizing Gale was empowered, draw a card into your memory.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack-declared",
                    subject: {
                      kind: "bound-object",
                      binding: "target-1",
                    },
                  },
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                    amount: 3,
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "activation-state",
                  state: "empowered",
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default galvanizingGale;
