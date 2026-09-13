import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/otherworldly-ossuary.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const otherworldlyOssuary = definePitchFamily(fabPitchFamilies["otherworldly-ossuary"], {
  keywords: [goAgain],
  abilities: () => ({
    createCorruptedCorpseInBanished: {
      kind: "resolution",
      effect: {
        type: "create-card",
        name: "Corrupted Corpse",
        to: { zone: "banished" },
        controller: "controller",
      },
    },
  }),
});

export const { blue: otherworldlyOssuaryBlue } = otherworldlyOssuary.cards;
