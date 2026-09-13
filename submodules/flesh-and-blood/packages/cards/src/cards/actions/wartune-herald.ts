import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wartune-herald.generated.ts";
import { phantasm } from "../shared/keywords.ts";

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
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "soul",
        },
      },
    },
  },
} as const;

export const wartuneHerald = definePitchFamily(fabPitchFamilies["wartune-herald"], {
  keywords: [phantasm],
  abilities: () => abilities,
});

export const {
  red: wartuneHeraldRed,
  yellow: wartuneHeraldYellow,
  blue: wartuneHeraldBlue,
} = wartuneHerald.cards;
