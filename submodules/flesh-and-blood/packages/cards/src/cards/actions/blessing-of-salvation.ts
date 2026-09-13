import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-salvation.generated.ts";

export const blessingOfSalvation = definePitchFamily(fabPitchFamilies["blessing-of-salvation"], {
  parameters: pitchMap({
    red: { lifeGain: 3 },
    yellow: { lifeGain: 2 },
    blue: { lifeGain: 1 },
  }),
  abilities: ({ lifeGain }) => ({
    staticPlayPerformedTurnPutIntoSoul: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "put-card-into-soul",
        player: "controller",
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand", "arsenal"],
        asType: "instant",
        optional: true,
      },
    },
    resolutionGainLife: {
      kind: "resolution",
      effect: {
        type: "gain-life",
        amount: lifeGain,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});

export const {
  red: blessingOfSalvationRed,
  yellow: blessingOfSalvationYellow,
  blue: blessingOfSalvationBlue,
} = blessingOfSalvation.cards;
