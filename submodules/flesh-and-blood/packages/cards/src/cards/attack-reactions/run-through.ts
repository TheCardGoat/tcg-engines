import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { goAgain } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/run-through.generated.ts";

const swordAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: { typeBox: { subtypes: ["Sword"] } },
  count: 1,
} as const;

export const runThrough = definePitchFamily(fabPitchFamilies["run-through"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    swordGoAgain: {
      type: "grant-property",
      property: { kind: "keyword", keyword: goAgain },
      target: swordAttack,
      duration: "this-turn",
      outputBinding: "it",
    },
    nextSwordBoost: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount,
      target: { selector: "this-attack" },
      duration: "this-turn",
      appliesTo: { next: { typeBox: { subtypes: ["Sword"] } } },
    },
  }),
});

export const {
  red: runThroughRed,
  yellow: runThroughYellow,
  blue: runThroughBlue,
} = runThrough.cards;
