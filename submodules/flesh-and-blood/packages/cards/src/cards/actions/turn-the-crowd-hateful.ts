import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/turn-the-crowd-hateful.generated.ts";

export const turnTheCrowdHateful = definePitchFamily(fabPitchFamilies["turn-the-crowd-hateful"], {
  abilities: () => ({
    gainCrowdBoosWhenAttackAttacks: {
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
                supertypes: ["Revered"],
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
          amount: 3,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    gainCrowdBoosWhenAttackHits: {
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
                supertypes: ["Revered"],
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
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});
export const {
  red: turnTheCrowdHatefulRed,
  yellow: turnTheCrowdHatefulYellow,
  blue: turnTheCrowdHatefulBlue,
} = turnTheCrowdHateful.cards;
