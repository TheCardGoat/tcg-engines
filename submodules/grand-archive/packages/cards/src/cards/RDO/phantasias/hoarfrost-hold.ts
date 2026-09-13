import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hoarfrostHold: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DNe5dvCNA1",
  slug: "hoarfrost-hold",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DNe5dvCNA1:face:default",
      catalogId: "DNe5dvCNA1",
      name: "Hoarfrost Hold",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SUITED", "SPELL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "[Class Bonus] On Enter:  Banish any amount of Suited Spell cards from your hand and/or memory. For each card banished this way, put a frost counter on Hoarfrost Hold.\n\nEach opponent recollects X less cards during the resolution of their recollection phase, where X is the amount of frost counters on Hoarfrost Hold. (They choose which cards to recollect.)",
      abilities: [
        {
          id: "DNe5dvCNA1-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter:  Banish any amount of Suited Spell cards from your hand and/or memory. For each card banished this way, put a frost counter on Hoarfrost Hold.",
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
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  },
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "banished-cards",
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "add-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: {
                    named: "frost",
                  },
                  amount: 1,
                },
              },
            ],
          },
        },
        {
          id: "DNe5dvCNA1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Each opponent recollects X less cards during the resolution of their recollection phase, where X is the amount of frost counters on Hoarfrost Hold. (They choose which cards to recollect.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "frost",
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-limit",
              action: "recollect",
              subject: {
                kind: "player",
                player: "each-opponent",
              },
              costOperation: "subtract",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "frost",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default hoarfrostHold;
