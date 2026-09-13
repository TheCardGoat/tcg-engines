import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sleep-dart.generated.ts";

const abilities = {
  triggeredEffect: {
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
        type: "rule-modification",
        mode: "restrict",
        action: "lose-abilities",
        filter: {
          typeBox: {
            types: ["Hero"],
          },
        },
        subject: {
          selector: "attack-target",
        },
        duration: "until-end-of-their-next-turn",
      },
    },
  },
} as const;

export const sleepDart = definePitchFamily(fabPitchFamilies["sleep-dart"], {
  abilities: () => abilities,
});

export const { red: sleepDartRed, yellow: sleepDartYellow, blue: sleepDartBlue } = sleepDart.cards;
