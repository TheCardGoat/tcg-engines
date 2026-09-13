import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/herald-of-triumph.generated.ts";
import { phantasm } from "../shared/keywords.ts";

const abilities = {
  whileModifyNumericPowerAllThisChainLink: {
    kind: "static",
    staticKind: "while",
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "subtract",
      amount: 1,
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "any",
        zones: ["combat-chain"],
        filter: attackActionFilter({ defending: true }),
        count: {
          type: "all",
        },
      },
      duration: "this-chain-link",
    },
  },
  triggeredHitMoveCard: {
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

export const heraldOfTriumph = definePitchFamily(fabPitchFamilies["herald-of-triumph"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: heraldOfTriumphRed,
  yellow: heraldOfTriumphYellow,
  blue: heraldOfTriumphBlue,
} = heraldOfTriumph.cards;
