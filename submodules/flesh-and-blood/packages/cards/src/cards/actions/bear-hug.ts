import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bear-hug.generated.ts";

export const bearHug = definePitchFamily(fabPitchFamilies["bear-hug"], {
  abilities: () => ({
    staticPlayPerformedTurnPitchPower6: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "pitch-power-6", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
  }),
});

export const { red: bearHugRed, yellow: bearHugYellow, blue: bearHugBlue } = bearHug.cards;
