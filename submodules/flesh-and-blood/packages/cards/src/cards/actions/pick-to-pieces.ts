import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pick-to-pieces.generated.ts";

export const pickToPieces = definePitchFamily(fabPitchFamilies["pick-to-pieces"], {
  keywords: [stealth],

  abilities: () => ({
    continuousHasStatusPlayedOrActivatedThisChainLinkAttackReactionSequenceModifyNumericPowerPermanentGrantPropertyContinuousRule:
      {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "played-or-activated-this-chain-link-attack-reaction",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "preventDamagePrevention",
                  text: "",
                  kind: "static",
                  staticKind: "continuous",
                  effect: {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "be-prevented",
                    subject: {
                      name: "This",
                    },
                    duration: "permanent",
                  },
                },
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          ],
        },
      },
  }),
});
export const {
  red: pickToPiecesRed,
  yellow: pickToPiecesYellow,
  blue: pickToPiecesBlue,
} = pickToPieces.cards;
