import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/emboldened-by-the-crowd.generated.ts";

export const emboldenedByTheCrowd = definePitchFamily(fabPitchFamilies["emboldened-by-the-crowd"], {
  abilities: () => ({
    reduceCostAfterCheering: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
      },
    },
  }),
});

export const { yellow: emboldenedByTheCrowdYellow } = emboldenedByTheCrowd.cards;
