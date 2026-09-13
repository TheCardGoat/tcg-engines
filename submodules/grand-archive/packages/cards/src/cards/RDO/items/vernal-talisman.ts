import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vernalTalisman: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dW5uyngvJW",
  slug: "vernal-talisman",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dW5uyngvJW:face:default",
      catalogId: "dW5uyngvJW",
      name: "Vernal Talisman",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ACCESSORY"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "As an additional cost to materialize this card, banish two preserved cards from your material deck. \n\n[Class Bonus] On Enter: Draw a card.\n\n[Class Bonus] REST: Empower 3. The next time you activate an empowered tera element Spell card this turn, recover 1.",
      abilities: [
        {
          id: "dW5uyngvJW-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this card, banish two preserved cards from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "object-state",
                  state: "preserved",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dW5uyngvJW-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "dW5uyngvJW-a3",
          kind: "activated",
          text: "[Class Bonus] REST: Empower 3. The next time you activate an empowered tera element Spell card this turn, recover 1.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
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
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                amount: 3,
              },
              {
                kind: "create-delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "card-activated",
                    actor: "controller",
                    activationState: "empowered",
                    subject: {
                      kind: "event-object",
                      controller: "controller",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "element",
                            oneOf: ["TERA"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["SPELL"],
                          },
                        ],
                      },
                    },
                  },
                },
                effect: {
                  kind: "recover",
                  player: "controller",
                  amount: 1,
                },
                limit: 1,
                expires: {
                  kind: "this-turn",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default vernalTalisman;
