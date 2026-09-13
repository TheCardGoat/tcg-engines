import { goAgain, legendary, wateryGrave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pearl-amulet.generated.ts";

export const pearlAmulet = definePitchFamily(fabPitchFamilies["pearl-amulet"], {
  keywords: [legendary, wateryGrave],
  abilities: () => ({
    actionDestroyUTargetPermanentGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "untap",
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["permanent"],
          count: 1,
        },
      },
    },
  }),
});

export const { blue: pearlAmuletBlue } = pearlAmulet.cards;
