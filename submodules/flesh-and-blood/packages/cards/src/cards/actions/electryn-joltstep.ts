import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/electryn-joltstep.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const electrynJoltstep = definePitchFamily(fabPitchFamilies["electryn-joltstep"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    resolutionModifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: powerBonus,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            or: [
              {
                typeBox: {
                  supertypes: ["Runeblade"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Lightning"],
                },
              },
            ],
          },
        },
      },
    },
    resolutionCreateTokenLightningFlow: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "lightning-flow",
        controller: "controller",
      },
    },
  }),
});
export const {
  red: electrynJoltstepRed,
  yellow: electrynJoltstepYellow,
  blue: electrynJoltstepBlue,
} = electrynJoltstep.cards;
