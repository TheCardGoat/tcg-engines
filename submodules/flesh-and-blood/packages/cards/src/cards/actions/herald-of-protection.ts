import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-protection.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  triggeredHitSequenceMoveCardCreateTokenSpectralShield: {
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
            type: "create-token",
            token: "spectral-shield",
            controller: "controller",
          },
        ],
      },
    },
  },
} as const;

export const heraldOfProtection = definePitchFamily(fabPitchFamilies["herald-of-protection"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: heraldOfProtectionRed,
  yellow: heraldOfProtectionYellow,
  blue: heraldOfProtectionBlue,
} = heraldOfProtection.cards;
