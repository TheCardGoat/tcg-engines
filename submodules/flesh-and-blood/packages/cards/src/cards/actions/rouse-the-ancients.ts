import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rouse-the-ancients.generated.ts";

export const rouseTheAncients = definePitchFamily(fabPitchFamilies["rouse-the-ancients"], {
  keywords: [goAgain],
  abilities: () => ({
    additionalCostPlayRouseAncientsRevealAnyNumberAttackActionHand13MoreTotalPowerRouseAncientsGains7PowerGoAgain:
      {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "additional-cost",
          optional: true,
          cost: {
            class: "effect",
            type: "reveal",
            from: "hand",
            filter: {
              typeBox: {
                types: ["Action"],
              },
            },
            count: {
              type: "all",
            },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 7,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
  }),
});

export const { blue: rouseTheAncientsBlue } = rouseTheAncients.cards;
