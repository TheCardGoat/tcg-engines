import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/blinding-beam.generated.ts";

export const blindingBeam = definePitchFamily(fabPitchFamilies["blinding-beam"], {
  parameters: pitchMap({
    red: 3,
    yellow: 2,
    blue: 1,
  }),
  abilities: (amount) => ({
    shadowCostReduction: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "binding-matches",
        binding: "it",
        filter: { typeBox: { supertypes: ["Shadow"] } },
      },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
    },
    weakenAttack: {
      type: "modify-numeric",
      property: "power",
      op: "subtract",
      amount,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        player: "any",
        filter: attackActionFilter(),
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
  }),
});

export const {
  red: blindingBeamRed,
  yellow: blindingBeamYellow,
  blue: blindingBeamBlue,
} = blindingBeam.cards;
