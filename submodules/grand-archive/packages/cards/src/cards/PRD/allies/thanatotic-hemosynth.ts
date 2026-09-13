import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const thanatoticHemosynth: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "MKiuesDVdW",
  slug: "thanatotic-hemosynth",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "MKiuesDVdW:face:default",
      catalogId: "MKiuesDVdW",
      name: "Thanatotic Hemosynth",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ELYSIAN", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        'Elysian Aura\n\n[Damage 10+] On Enter: Target Aenean Spell card in your graveyard gains "Ephemerate — (X)", where X is that card’s reserve cost. (You may activate cards with ephemerate from your graveyard by paying that cost. Action cards played this way become ephemeral on the effects stack.)',
      abilities: [
        {
          id: "MKiuesDVdW-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Elysian Aura",
          keyword: {
            name: "elysian-aura",
          },
        },
        {
          id: "MKiuesDVdW-a2",
          kind: "triggered",
          text: '[Damage 10+] On Enter: Target Aenean Spell card in your graveyard gains "Ephemerate — (X)", where X is that card’s reserve cost. (You may activate cards with ephemerate from your graveyard by paying that cost. Action cards played this way become ephemeral on the effects stack.)',
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-aenean-spell",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "target-aenean-spell",
                },
                property: "reserve-cost",
                basis: "base",
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 10,
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-aenean-spell",
            },
            affectedSet: "locked",
            duration: {
              kind: "while-subjects-in-zone",
              subjects: {
                kind: "bound",
                binding: "target-aenean-spell",
              },
              zone: "graveyard",
              scope: "per-object",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "ephemerate",
                cost: {
                  kind: "pay-reserve",
                  amount: {
                    kind: "property",
                    subject: {
                      kind: "bound",
                      binding: "target-aenean-spell",
                    },
                    property: "reserve-cost",
                    basis: "base",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default thanatoticHemosynth;
