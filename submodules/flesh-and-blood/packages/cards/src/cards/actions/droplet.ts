import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/droplet.generated.ts";

export const droplet = definePitchFamily(fabPitchFamilies["droplet"], {
  abilities: () => ({
    ifVePlayedAnotherBlueTurnGets2: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-blue-card",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: dropletBlue } = droplet.cards;
