import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sigil-of-solitude.generated.ts";
import { ward } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "start-phase",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "none",
        },
      },
      state: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          typeBox: {
            supertypes: ["Illusionist"],
            subtypes: ["Aura"],
          },
        },
        comparison: {
          op: "gte",
          value: 2,
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
} as const;

export const sigilOfSolitude = definePitchFamily(fabPitchFamilies["sigil-of-solitude"], {
  keywords: [ward(4)],
  abilities: () => abilities,
});

export const {
  red: sigilOfSolitudeRed,
  yellow: sigilOfSolitudeYellow,
  blue: sigilOfSolitudeBlue,
} = sigilOfSolitude.cards;
