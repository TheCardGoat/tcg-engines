import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/single-minded-determination.generated.ts";
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
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: 3,
        target: {
          selector: "self",
        },
      },
    },
  },
} as const;

export const singleMindedDetermination = definePitchFamily(
  fabPitchFamilies["single-minded-determination"],
  {
    keywords: [ward(2)],
    abilities: () => abilities,
  },
);

export const {
  red: singleMindedDeterminationRed,
  yellow: singleMindedDeterminationYellow,
  blue: singleMindedDeterminationBlue,
} = singleMindedDetermination.cards;
