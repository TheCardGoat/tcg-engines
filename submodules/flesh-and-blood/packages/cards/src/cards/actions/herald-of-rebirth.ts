import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-rebirth.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  triggeredHitSequenceMoveCardMoveCardUpTo: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                hasKeyword: "phantasm",
              },
              count: {
                type: "up-to",
                amount: 1,
              },
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        ],
      },
    },
  },
} as const;

export const heraldOfRebirth = definePitchFamily(fabPitchFamilies["herald-of-rebirth"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: heraldOfRebirthRed,
  yellow: heraldOfRebirthYellow,
  blue: heraldOfRebirthBlue,
} = heraldOfRebirth.cards;
