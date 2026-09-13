import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/roaring-beam.generated.ts";

export const roaringBeam = definePitchFamily(fabPitchFamilies["roaring-beam"], {
  abilities: () => ({
    createCourage: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "courage",
        controller: "controller",
      },
      label: {
        name: "charge",
      },
    },
    returnAndChargeWithEmptySoul: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "soul",
        player: "controller",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "hand",
            },
          },
          {
            type: "charge",
            target: {
              selector: "controller",
            },
          },
        ],
      },
      label: {
        name: "charge",
      },
    },
  }),
});

export const { yellow: roaringBeamYellow } = roaringBeam.cards;
