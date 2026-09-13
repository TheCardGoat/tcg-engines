import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/haunting-rendition.generated.ts";

export const hauntingRendition = definePitchFamily(fabPitchFamilies["haunting-rendition"], {
  abilities: () => ({
    discardToPreventAndCreateRunechant: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        additionalModification: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: hauntingRenditionRed } = hauntingRendition.cards;
