import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bounding-demigon.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const boundingDemigon = definePitchFamily(fabPitchFamilies["bounding-demigon"], {
  keywords: [bloodDebt],
  abilities: () => ({
    staticPlayPerformedTurnPlayNonAttackActionModifyNumeric: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "play-non-attack-action",
        player: "controller",
      },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const {
  red: boundingDemigonRed,
  yellow: boundingDemigonYellow,
  blue: boundingDemigonBlue,
} = boundingDemigon.cards;
