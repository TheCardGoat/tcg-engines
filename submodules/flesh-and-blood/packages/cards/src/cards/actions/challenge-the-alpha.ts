import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/challenge-the-alpha.generated.ts";

export const challengeTheAlpha = definePitchFamily(fabPitchFamilies["challenge-the-alpha"], {
  abilities: () => ({
    whenAttacksBruteHeroGets2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Brute"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
    whenHitsBruteHeroTheyDiscardIfHas6: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Brute"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              target: {
                selector: "attack-target",
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
                type: "lose-life",
                amount: 2,
                target: {
                  selector: "controller",
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { yellow: challengeTheAlphaYellow } = challengeTheAlpha.cards;
