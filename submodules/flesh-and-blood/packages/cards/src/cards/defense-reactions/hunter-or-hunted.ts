import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/hunter-or-hunted.generated.ts";

export const hunterOrHunted = definePitchFamily(fabPitchFamilies["hunter-or-hunted"], {
  abilities: () => ({
    nameAndBanishCards: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["visible-cards"],
            },
            {
              type: "contract-task",
              task: "banish opponents' cards with the chosen name",
              completeOn: "banish",
              filter: {
                hasStatus: "named-card",
              },
            },
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attacking-hero",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  hasStatus: "named-card",
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "banish",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  {
                    type: "search",
                    zones: ["hand", "deck", "arsenal"],
                    player: "attacking-hero",
                    filter: {
                      hasStatus: "named-card",
                    },
                    count: {
                      type: "up-to",
                      amount: 3,
                    },
                    to: {
                      zone: "banished",
                    },
                  },
                ],
              },
            },
            {
              type: "shuffle",
            },
          ],
        },
      },
    },
    chosenNameContract: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "contract-task",
        task: "banish opponents' cards with the chosen name",
        completeOn: "banish",
        filter: { hasStatus: "named-card" },
      },
      label: {
        name: "contract",
      },
    },
    createSilverOnContract: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "complete-contract",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "has-status",
          status: "defending",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "silver",
          controller: "controller",
        },
      },
      label: {
        name: "contract",
      },
    },
  }),
});

export const { blue: hunterOrHuntedBlue } = hunterOrHunted.cards;
