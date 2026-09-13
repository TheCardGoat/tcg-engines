import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { piercing } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/puncture.generated.ts";

const edgedAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: { or: [{ typeBox: { subtypes: ["Sword"] } }, { typeBox: { subtypes: ["Dagger"] } }] },
  count: 1,
} as const;

export const puncture = definePitchFamily(fabPitchFamilies.puncture, {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    piercingBoost: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: edgedAttack,
          duration: "this-turn",
        },
        {
          type: "grant-property",
          property: { kind: "keyword", keyword: piercing(1) },
          target: edgedAttack,
          duration: "this-turn",
        },
      ],
      outputBinding: "it",
    },
  }),
});

export const { red: punctureRed, yellow: punctureYellow, blue: punctureBlue } = puncture.cards;
