import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/weave-ice.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const weaveIce = definePitchFamily(fabPitchFamilies["weave-ice"], {
  keywords: [goAgain],
  abilities: (_parameter, { pitch }) => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4 - Number(pitch),
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          or: [
            {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
            {
              typeBox: {
                supertypes: ["Elemental"],
              },
            },
          ],
        }),
      },
    },
    resolutionGrantProperty: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          hasStatus: "fused",
          or: [
            {
              typeBox: {
                supertypes: ["Ice"],
              },
            },
            {
              typeBox: {
                supertypes: ["Elemental"],
              },
            },
          ],
        }),
      },
    },
  }),
});

export const { red: weaveIceRed, yellow: weaveIceYellow, blue: weaveIceBlue } = weaveIce.cards;
