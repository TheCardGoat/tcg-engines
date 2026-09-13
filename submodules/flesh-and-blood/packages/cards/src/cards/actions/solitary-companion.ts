import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/solitary-companion.generated.ts";
import { ward } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "enter-arena",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
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
          op: "eq",
          value: 1,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
      },
    },
  },
} as const;

export const solitaryCompanion = definePitchFamily(fabPitchFamilies["solitary-companion"], {
  keywords: [ward(3)],
  abilities: () => abilities,
});

export const {
  red: solitaryCompanionRed,
  yellow: solitaryCompanionYellow,
  blue: solitaryCompanionBlue,
} = solitaryCompanion.cards;
