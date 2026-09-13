import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/tome-of-quandaries.generated.ts";

export const tomeOfQuandaries = definePitchFamily(fabPitchFamilies["tome-of-quandaries"], {
  abilities: () => ({
    create2PonderTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "ponder",
        controller: "controller",
        count: 2,
      },
    },
  }),
});

export const { blue: tomeOfQuandariesBlue } = tomeOfQuandaries.cards;
