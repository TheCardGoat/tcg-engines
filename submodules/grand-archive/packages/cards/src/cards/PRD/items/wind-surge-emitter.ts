import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windSurgeEmitter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Y8s7XGHqHk",
  slug: "wind-surge-emitter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Y8s7XGHqHk:face:default",
      catalogId: "Y8s7XGHqHk",
      name: "Wind Surge Emitter",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] (4), REST: Put a buff counter on target ally without a buff counter on it. As long as you've activated an Aenean Spell card this turn, this ability costs (4) less to activate. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "Y8s7XGHqHk-a1",
          kind: "activated",
          text: "[Class Bonus] (4), REST: Put a buff counter on target ally without a buff counter on it. As long as you've activated an Aenean Spell card this turn, this ability costs (4) less to activate. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 4,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-ally",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "has-counter",
                        counter: "buff",
                      },
                    },
                  ],
                },
              },
            },
          ],
          costModifiers: [
            {
              operation: "subtract",
              amount: 4,
              condition: {
                kind: "history",
                event: "card-activated",
                window: "this-turn",
                actor: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["AENEAN"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
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
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-ally",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default windSurgeEmitter;
