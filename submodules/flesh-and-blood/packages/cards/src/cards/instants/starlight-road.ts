import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/starlight-road.generated.ts";

export const starlightRoad = definePitchFamily(fabPitchFamilies["starlight-road"], {
  abilities: () => ({
    createEmbodimentLightningLightningFlowToken: {
      kind: "resolution",
      effect: {
        type: "choose-and-create-token",
        options: ["embodiment-of-lightning", "lightning-flow"],
        chooser: "controller",
        controller: "controller",
      },
    },
  }),
});

export const { blue: starlightRoadBlue } = starlightRoad.cards;
