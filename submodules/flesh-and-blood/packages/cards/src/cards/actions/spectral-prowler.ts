import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spectral-prowler.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "play",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "event-object",
          selector: "played-card",
          relationship: {
            kind: "any",
          },
          filter: {
            name: "Spectral Prowler",
          },
        },
      },
      state: {
        type: "control-object",
        filter: {
          name: "Spectral Shield",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "go-again",
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
} as const;

export const spectralProwler = definePitchFamily(fabPitchFamilies["spectral-prowler"], {
  keywords: [phantasm],
  abilities: () => abilities,
});

export const {
  red: spectralProwlerRed,
  yellow: spectralProwlerYellow,
  blue: spectralProwlerBlue,
} = spectralProwler.cards;
