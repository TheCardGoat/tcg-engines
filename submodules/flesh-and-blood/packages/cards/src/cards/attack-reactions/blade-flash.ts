import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/blade-flash.generated.ts";

export const bladeFlash = definePitchFamily(fabPitchFamilies["blade-flash"], {
  abilities: () => ({
    swordGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          // Attack reactions choose a sword attack. Weapon attacks remain in the
          // weapon zone while also being the active combat attack; AAC swords
          // sit on the combat chain.
          declared: "at-resolution",
          zones: ["combat-chain", "weapon"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { blue: bladeFlashBlue } = bladeFlash.cards;
