import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/take-flight.generated.ts";

const abilities = {
  playUndefined: {
    kind: "static",
    staticKind: "play",
    playEffect: {
      role: "additional-cost",
      cost: {
        class: "effect",
        type: "charge",
      },
      optional: true,
    },
    label: {
      name: "charge",
    },
  },
  resolutionGrantProperty: {
    kind: "resolution",
    condition: {
      type: "performed-this-turn",
      event: "charge",
      player: "controller",
    },
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
      duration: "this-turn",
    },
    label: {
      name: "charge",
    },
  },
} as const;

export const takeFlight = definePitchFamily(fabPitchFamilies["take-flight"], {
  abilities: () => abilities,
});

export const {
  red: takeFlightRed,
  yellow: takeFlightYellow,
  blue: takeFlightBlue,
} = takeFlight.cards;
