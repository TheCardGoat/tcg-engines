import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/back-heel-kick.generated.ts";

import { combo } from "../shared/keywords.ts";

const abilities = {
  gainPowerAfterTwinTwisters: {
    kind: "static",
    staticKind: "while",
    condition: {
      type: "last-attack-this-combat-chain",
      names: ["Twin Twisters"],
    },
    effect: {
      type: "rule-modification",
      mode: "amplify",
      action: "gain-power",
      amount: 1,
      subject: {
        selector: "self",
      },
      duration: "permanent",
    },
    label: {
      name: "combo",
      params: {
        names: ["Twin Twisters"],
      },
    },
  },
} as const;

export const backHeelKick = definePitchFamily(fabPitchFamilies["back-heel-kick"], {
  keywords: [combo],
  abilities: () => ({ ...abilities }),
});

export const {
  red: backHeelKickRed,
  yellow: backHeelKickYellow,
  blue: backHeelKickBlue,
} = backHeelKick.cards;
