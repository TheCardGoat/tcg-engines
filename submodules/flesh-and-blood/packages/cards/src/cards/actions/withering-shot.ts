import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/withering-shot.generated.ts";

export const witheringShot = definePitchFamily(fabPitchFamilies["withering-shot"], {
  parameters: pitchMap({
    red: { value1: 1, textValue1: 1 },
    yellow: { value1: 1, textValue1: 1 },
    blue: { value1: 1, textValue1: 1 },
  }),
  abilities: ({ value1, textValue1: _textValue1 }) => ({
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "named",
          name: "aim",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    triggeredStaticOnHitEffect: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "frailty",
          controller: "attack-target",
        },
      },
    },
  }),
});

export const {
  red: witheringShotRed,
  yellow: witheringShotYellow,
  blue: witheringShotBlue,
} = witheringShot.cards;
