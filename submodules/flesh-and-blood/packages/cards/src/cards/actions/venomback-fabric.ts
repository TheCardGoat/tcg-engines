import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/venomback-fabric.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const venombackFabric = definePitchFamily(fabPitchFamilies["venomback-fabric"], {
  keywords: [legendary],
  abilities: () => ({
    equipScabskinLeathersDonTNegate: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "negate",
          target: {
            selector: "self",
          },
        },
        escape: {
          type: "equip",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["inventory", "hand", "deck"],
            filter: {
              name: "Scabskin Leathers",
            },
            count: 1,
          },
        },
      },
      label: {
        name: "negate",
      },
    },
  }),
});

export const { yellow: venombackFabricYellow } = venombackFabric.cards;
