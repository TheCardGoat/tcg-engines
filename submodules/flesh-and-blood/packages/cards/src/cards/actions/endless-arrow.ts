import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/endless-arrow.generated.ts";

export const endlessArrow = definePitchFamily(fabPitchFamilies["endless-arrow"], {
  abilities: () => ({
    whenHitsPutIntoOwnerSHand: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "hand",
          },
        },
      },
    },
  }),
});
export const { red: endlessArrowRed } = endlessArrow.cards;
