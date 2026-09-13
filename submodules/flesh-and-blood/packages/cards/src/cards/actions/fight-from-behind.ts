import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/fight-from-behind.generated.ts";

export const fightFromBehind = definePitchFamily(fabPitchFamilies["fight-from-behind"], {
  abilities: () => ({
    onAttackStatic: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
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
    onDefendStatic: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
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
  red: fightFromBehindRed,
  yellow: fightFromBehindYellow,
  blue: fightFromBehindBlue,
} = fightFromBehind.cards;
