import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/tide-chakra.generated.ts";

const assassinOrMysticAttackAction = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: attackActionFilter({
    or: [{ typeBox: { supertypes: ["Assassin"] } }, { typeBox: { supertypes: ["Mystic"] } }],
  }),
  count: 1,
} as const;
export const tideChakra = definePitchFamily(fabPitchFamilies["tide-chakra"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    transcendBoost: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: assassinOrMysticAttackAction,
          duration: "this-turn",
          outputBinding: "it",
        },
        {
          type: "self-replacement",
          condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
          modification: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: amount + 2,
            target: assassinOrMysticAttackAction,
            duration: "this-turn",
          },
        },
      ],
    },
  }),
});
export const {
  red: tideChakraRed,
  yellow: tideChakraYellow,
  blue: tideChakraBlue,
} = tideChakra.cards;
