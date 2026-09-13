import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/volatile-fluxor.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {
  resolutionModifyNumeric: {
    kind: "resolution",
    condition: {
      type: "played-this",
      per: "chain-link",
      filter: {
        typeBox: {
          types: ["Instant"],
        },
      },
      comparison: {
        op: "gte",
        value: 1,
      },
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 3,
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
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
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  },
} as const;

export const volatileFluxor = definePitchFamily(fabPitchFamilies["volatile-fluxor"], {
  keywords: [goAgain],
  abilities: () => abilities,
});

export const {
  red: volatileFluxorRed,
  yellow: volatileFluxorYellow,
  blue: volatileFluxorBlue,
} = volatileFluxor.cards;
