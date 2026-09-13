import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/infect.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  triggeredHitCreateTokenBloodrotPox: {
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
        token: "bloodrot-pox",
        controller: "attack-target",
      },
    },
  },
} as const;

export const infect = definePitchFamily(fabPitchFamilies["infect"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const { red: infectRed, yellow: infectYellow, blue: infectBlue } = infect.cards;
