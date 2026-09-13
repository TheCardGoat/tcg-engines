import { goAgain, legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pounamu-amulet.generated.ts";

export const pounamuAmulet = definePitchFamily(fabPitchFamilies["pounamu-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    actionDestroyGain2LifeGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-life",
        amount: 2,
        target: {
          selector: "controller",
        },
      },
    },
  }),
});

export const { blue: pounamuAmuletBlue } = pounamuAmulet.cards;
