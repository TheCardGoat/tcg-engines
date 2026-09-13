import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/comeback-kid.generated.ts";

export const comebackKid = definePitchFamily(fabPitchFamilies["comeback-kid"], {
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
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
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
    onCrowdCheersModifyNumericPower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "crowd-cheers",
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
  }),
});
export const {
  red: comebackKidRed,
  yellow: comebackKidYellow,
  blue: comebackKidBlue,
} = comebackKid.cards;
