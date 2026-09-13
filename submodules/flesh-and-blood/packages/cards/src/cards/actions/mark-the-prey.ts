import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mark-the-prey.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  triggeredHitMark: {
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
        type: "mark",
        target: {
          selector: "attack-target",
        },
      },
    },
    label: {
      name: "mark",
    },
  },
} as const;

export const markThePrey = definePitchFamily(fabPitchFamilies["mark-the-prey"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: markThePreyRed,
  yellow: markThePreyYellow,
  blue: markThePreyBlue,
} = markThePrey.cards;
