import { attackActionFilter, crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/chokeslam.generated.ts";

export const chokeslam = definePitchFamily(fabPitchFamilies["chokeslam"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "gain-power",
        subject: {
          selector: "object",
          declared: "at-resolution",
          player: { binding: "damage-target-controller" },
          zones: ["stack", "combat-chain"],
          filter: attackActionFilter(),
          count: {
            type: "all",
          },
        },
        duration: "during-their-next-action-phase",
      },
    }),
  }),
});
export const { red: chokeslamRed, yellow: chokeslamYellow, blue: chokeslamBlue } = chokeslam.cards;
