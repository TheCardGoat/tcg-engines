import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blossomingDenial: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1nnpbddblx",
  slug: "blossoming-denial",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1nnpbddblx:face:default",
      catalogId: "1nnpbddblx",
      name: "Blossoming Denial",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] As long as an opponent has five or more cards in their memory, this card costs 3 less to activate.  \n\nNegate up to one target card activation unless its controller pays (3). Each opponent summons two Flowerbud tokens.\n\n[Level 5+] Recover X, where X is the amount of phantasias on the field.",
      abilities: [
        {
          id: "1nnpbddblx-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent has five or more cards in their memory, this card costs 3 less to activate.",
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
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "memory",
                operator: "gte",
                value: 5,
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1nnpbddblx-a2",
          kind: "card-resolution",
          text: "Negate up to one target card activation unless its controller pays (3). Each opponent summons two Flowerbud tokens.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 3,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "summon",
                controller: "each-opponent",
                object: "Flowerbud",
                amount: 2,
              },
            ],
          },
        },
        {
          id: "1nnpbddblx-a3",
          kind: "card-resolution",
          text: "[Level 5+] Recover X, where X is the amount of phantasias on the field.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 5,
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
      ],
    },
  },
};

export default blossomingDenial;
