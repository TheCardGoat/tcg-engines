import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mordredFatedLuminary: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "KqBosnU7pU",
  slug: "mordred-fated-luminary",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "KqBosnU7pU:face:default",
      catalogId: "KqBosnU7pU",
      name: "Mordred, Fated Luminary",
      lineageName: "Mordred",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        level: 3,
        life: 28,
      },
      rulesText:
        'Mordred Lineage\n\nMordred can level up into champions of the same base level. When he does, draw two cards.\n\nAttack cards in your graveyard have floating memory and "Ephemerate — (X)", where X is that card\'s reserve cost. (You may activate cards with ephemerate from your graveyard by paying that cost. Attack cards played this way become ephemeral in the intent.)',
      abilities: [
        {
          id: "KqBosnU7pU-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Mordred Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Mordred",
          },
        },
        {
          id: "KqBosnU7pU-a2",
          kind: "composite",
          text: "Mordred can level up into champions of the same base level. When he does, draw two cards.",
          abilities: [
            {
              id: "KqBosnU7pU-a10002",
              kind: "static",
              staticKind: "effects",
              text: "Mordred, Fated Luminary can level up into champions of the same base level.",
              effects: [
                {
                  kind: "rule-modification",
                  mode: "allow",
                  action: "level-up",
                  subject: {
                    kind: "source",
                  },
                  destinationFilter: {
                    kind: "numeric",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "candidate",
                        },
                        property: "level",
                        basis: "base",
                      },
                      operator: "eq",
                      right: {
                        kind: "property",
                        subject: {
                          kind: "source",
                        },
                        property: "level",
                        basis: "base",
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
              id: "KqBosnU7pU-a10003",
              kind: "triggered",
              text: "When Mordred, Fated Luminary levels up this way, draw two cards.",
              trigger: {
                kind: "event",
                event: {
                  name: "champion-leveled-up",
                  actor: "controller",
                  previousObject: {
                    kind: "source",
                  },
                },
              },
              effect: {
                kind: "draw",
                player: "controller",
                amount: 2,
              },
            },
          ],
        },
        {
          id: "KqBosnU7pU-a3",
          kind: "static",
          staticKind: "effects",
          text: 'Attack cards in your graveyard have floating memory and "Ephemerate — (X)", where X is that card\'s reserve cost. (You may activate cards with ephemerate from your graveyard by paying that cost. Attack cards played this way become ephemeral in the intent.)',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ATTACK"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "floating-memory",
                },
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ATTACK"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                        kind: "candidate",
                      },
                      property: "reserve-cost",
                      basis: "base",
                    },
                  },
                  activationResult: {
                    entryState: {
                      state: "ephemeral",
                      value: true,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default mordredFatedLuminary;
