import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const amorphousStrike: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5kt3q2svd5",
  slug: "amorphous-strike",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5kt3q2svd5:face:default",
      catalogId: "5kt3q2svd5",
      name: "Amorphous Strike",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NEOS"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish an attack card from your graveyard. If you do, Amorphous Strike gets +X POWER where X is the banished card's power.",
      abilities: [
        {
          id: "5kt3q2svd5-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish an attack card from your graveyard. If you do, Amorphous Strike gets +X POWER where X is the banished card's power.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
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
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "type",
                        oneOf: ["ATTACK"],
                      },
                    },
                  },
                  bindResultAs: "banished-cards",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "source",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "permanent",
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
                    amount: {
                      kind: "property",
                      subject: {
                        kind: "bound",
                        binding: "banished-cards",
                      },
                      property: "power",
                      basis: "last-known",
                      missing: "zero",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default amorphousStrike;
