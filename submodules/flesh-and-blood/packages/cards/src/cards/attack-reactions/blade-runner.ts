import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { goAgain } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/blade-runner.generated.ts";

export const bladeRunner = definePitchFamily(fabPitchFamilies["blade-runner"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    weaponGoAgain: {
      type: "grant-property",
      property: { kind: "keyword", keyword: goAgain },
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["combat-chain"],
        filter: { typeBox: { types: ["Weapon"], subtypes: ["1H"] } },
        count: 1,
      },
      duration: "this-turn",
      outputBinding: "it",
    },
    nextWeaponBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: { next: { typeBox: { types: ["Weapon"] } } },
    },
  }),
});

export const {
  red: bladeRunnerRed,
  yellow: bladeRunnerYellow,
  blue: bladeRunnerBlue,
} = bladeRunner.cards;
