import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-energy.generated.ts";

export const risingEnergy = definePitchFamily(fabPitchFamilies["rising-energy"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    playPerformedThisTurnDrawResources: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
    },
  }),
});

export const {
  red: risingEnergyRed,
  yellow: risingEnergyYellow,
  blue: risingEnergyBlue,
} = risingEnergy.cards;
