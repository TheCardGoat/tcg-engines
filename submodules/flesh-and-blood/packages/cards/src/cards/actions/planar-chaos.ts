import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/planar-chaos.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const planarChaos = definePitchFamily(fabPitchFamilies["planar-chaos"], {
  keywords: [goAgain],
  abilities: () => ({
    gate: { type: "create-token", token: "gate-to-i-arathael", controller: "controller" },
    widenNextGate: {
      type: "rule-modification",
      mode: "allow",
      action: "play-card-target",
      targetPlayer: "any",
      duration: "this-turn",
      appliesTo: {
        next: { name: "Gate to i'Arathael", typeBox: { metatypes: ["Token"] } },
        events: ["activate"],
      },
    },
  }),
});
export const { red: planarChaosRed } = planarChaos.cards;
