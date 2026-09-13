import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/wind-chakra.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const nextCrouchingTigerAttack = {
  selector: "this-attack",
} as const;

const nextCrouchingTiger = {
  next: {
    name: "Crouching Tiger",
  },
} as const;

export const windChakra = definePitchFamily(fabPitchFamilies["wind-chakra"], {
  parameters: pitchMap({
    red: { bonus: 3, transcendedBonus: 5 },
    yellow: { bonus: 2, transcendedBonus: 4 },
    blue: { bonus: 2, transcendedBonus: 4 },
  }),
  keywords: [goAgain],
  abilities: ({ bonus: _bonus, transcendedBonus: _transcendedBonus }) => ({
    resolutionSequence: {
      kind: "resolution",
      // CR 6.4.7: condition is known at generation; keep appliesTo.next.
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: nextCrouchingTigerAttack,
            duration: "this-turn",
            appliesTo: nextCrouchingTiger,
          },
          {
            type: "self-replacement",
            condition: { type: "performed-this-turn", event: "transcend", player: "controller" },
            modification: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 5,
              target: nextCrouchingTigerAttack,
              duration: "this-turn",
              appliesTo: nextCrouchingTiger,
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: windChakraRed,
  yellow: windChakraYellow,
  blue: windChakraBlue,
} = windChakra.cards;
