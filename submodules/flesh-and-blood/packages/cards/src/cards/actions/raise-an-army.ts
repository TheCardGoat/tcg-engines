import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/raise-an-army.generated.ts";

export const raiseAnArmy = definePitchFamily(fabPitchFamilies["raise-an-army"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kassai",
    },
    goAgain,
  ],
  abilities: () => ({
    additionalCostPlayDestroyXGold: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          count: {
            type: "x",
          },
          filter: {
            name: "Gold",
          },
        },
      },
    },
    createXCintariSellswordTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "cintari-sellsword",
        controller: "controller",
        count: {
          type: "x",
        },
      },
    },
  }),
});

export const { yellow: raiseAnArmyYellow } = raiseAnArmy.cards;
