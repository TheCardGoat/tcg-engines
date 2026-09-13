import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dimenxxional-gateway.generated.ts";
import { goAgain, opt } from "../shared/keywords.ts";
export const dimenxxionalGateway = definePitchFamily(fabPitchFamilies["dimenxxional-gateway"], {
  keywords: pitchMap({
    red: [opt(3), goAgain],
    yellow: [opt(2), goAgain],
    blue: [opt(1), goAgain],
  }),
  abilities: () => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  supertypes: ["Runeblade"],
                },
              },
            },
            then: {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hero"],
                count: {
                  type: "all",
                },
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  supertypes: ["Shadow"],
                },
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
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
  red: dimenxxionalGatewayRed,
  yellow: dimenxxionalGatewayYellow,
  blue: dimenxxionalGatewayBlue,
} = dimenxxionalGateway.cards;
