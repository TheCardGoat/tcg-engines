import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/turn-the-crowd-grateful.generated.ts";

export const turnTheCrowdGrateful = definePitchFamily(fabPitchFamilies["turn-the-crowd-grateful"], {
  abilities: () => ({
    gainCrowdCheersWhenAttackAttacks: {
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
                supertypes: ["Reviled"],
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
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    gainCrowdCheersWhenAttackHits: {
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
                supertypes: ["Reviled"],
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
          type: "crowd-cheers",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});
export const {
  red: turnTheCrowdGratefulRed,
  yellow: turnTheCrowdGratefulYellow,
  blue: turnTheCrowdGratefulBlue,
} = turnTheCrowdGrateful.cards;
