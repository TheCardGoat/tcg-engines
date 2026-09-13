import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/frightmare.generated.ts";

import { phantasm } from "../shared/keywords.ts";

export const frightmare = definePitchFamily(fabPitchFamilies["frightmare"], {
  keywords: [phantasm],
  abilities: () => ({
    playFrightmareOnlyIfIllusionistAttackActionControlHas: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "phantasm-destroy-illusionist-attack-action",
        player: "controller",
      },
      playEffect: {
        role: "condition",
      },
    },
  }),
});
export const { red: frightmareRed } = frightmare.cards;
