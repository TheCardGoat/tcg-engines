import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skyzyk.generated.ts";

/**
 * Model notes (hand-authored): "+1{p} if this has go again" is a continuous
 * static, not a one-shot resolution effect.
 */
export const skyzyk = definePitchFamily(fabPitchFamilies["skyzyk"], {
  abilities: () => ({
    hasGoAgainGetsNumber1Power: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { red: skyzykRed } = skyzyk.cards;
