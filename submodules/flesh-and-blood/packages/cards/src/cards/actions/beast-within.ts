import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beast-within.generated.ts";

/** Model notes (hand-authored): triggered when this is put into the GY from a non-combat-chain zone; repeat until the banished card has 6+ {p}. */
export const beastWithin = definePitchFamily(fabPitchFamilies["beast-within"], {
  abilities: () => ({
    ifBeastWithinIsPutIntoGraveyardFromAnywhere: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "put-into-graveyard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
          excludeFrom: ["combat-chain"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "lose-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
              then: {
                type: "move-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                to: {
                  zone: "hand",
                },
              },
              else: {
                type: "repeat",
                until: "declined",
                effect: {
                  type: "sequence",
                  steps: [
                    {
                      type: "banish",
                      target: {
                        selector: "object",
                        declared: "at-resolution",
                        player: "controller",
                        zones: ["deck"],
                        position: "top",
                        count: 1,
                      },
                      outputBinding: "it",
                    },
                    {
                      type: "lose-life",
                      amount: 1,
                      target: {
                        selector: "controller",
                      },
                    },
                    {
                      type: "conditional",
                      condition: {
                        type: "binding-matches",
                        binding: "it",
                        filter: {
                          power: {
                            op: "gte",
                            value: 6,
                          },
                        },
                      },
                      then: {
                        type: "move-card",
                        target: {
                          selector: "binding",
                          binding: "it",
                        },
                        to: {
                          zone: "hand",
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
    },
  }),
});
export const { yellow: beastWithinYellow } = beastWithin.cards;
