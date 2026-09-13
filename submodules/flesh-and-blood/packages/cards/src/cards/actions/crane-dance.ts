import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crane-dance.generated.ts";
import { combo } from "../shared/keywords.ts";
const abilities = {
  modifyNumericGrantPropertyPower: {
    kind: "resolution",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "go-again",
            },
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        {
          type: "rule-modification",
          mode: "restrict",
          action: "defend",
          filter: attackActionFilter({
            power: {
              op: "gt",
              value: {
                type: "count",
                what: "chain-links",
                player: "controller",
              },
            },
          }),
          duration: "this-turn",
        },
      ],
    },
    label: {
      name: "combo",
      params: {
        names: ["Soulbead Strike"],
      },
    },
    condition: {
      type: "last-attack-this-combat-chain",
      names: ["Soulbead Strike"],
    },
  },
} as const;
export const craneDance = definePitchFamily(fabPitchFamilies["crane-dance"], {
  keywords: [combo],
  abilities: () => ({ ...abilities }),
});
export const {
  red: craneDanceRed,
  yellow: craneDanceYellow,
  blue: craneDanceBlue,
} = craneDance.cards;
