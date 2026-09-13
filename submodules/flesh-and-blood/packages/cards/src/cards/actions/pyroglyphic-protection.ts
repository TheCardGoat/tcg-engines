import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pyroglyphic-protection.generated.ts";

export const pyroglyphicProtection = definePitchFamily(fabPitchFamilies["pyroglyphic-protection"], {
  abilities: (_parameter, { pitch }) => ({
    continuousPreventionWhileInArena: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 4 - Number(pitch),
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        duration: "while-in-arena",
      },
    },
    triggeredActionPhaseStartDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const {
  red: pyroglyphicProtectionRed,
  yellow: pyroglyphicProtectionYellow,
  blue: pyroglyphicProtectionBlue,
} = pyroglyphicProtection.cards;
