import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/increase-the-tension.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const increaseTheTension = definePitchFamily(fabPitchFamilies["increase-the-tension"], {
  parameters: {
    red: { value1: 3, textValue1: 3 },
    yellow: { value1: 2, textValue1: 2 },
    blue: { value1: 1, textValue1: 1 },
  },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    sequenceModifyNumericPowerThisTurnGrantPropertyRuleModificationRestrictPlayThisChainLinkThisTurn:
      {
        kind: "resolution",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: value1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  id: "ruleModificationRestrictPlayThisChainLink",
                  text: "",
                  kind: "resolution",
                  effect: {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "play",
                    filter: {
                      typeBox: { types: ["Defense Reaction"] },
                      playedFromZones: ["hand"],
                    },
                    duration: "this-chain-link",
                  },
                },
              },
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
            },
          ],
        },
      },
  }),
});

export const {
  red: increaseTheTensionRed,
  yellow: increaseTheTensionYellow,
  blue: increaseTheTensionBlue,
} = increaseTheTension.cards;
