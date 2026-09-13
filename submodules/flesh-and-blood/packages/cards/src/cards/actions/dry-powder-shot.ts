import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dry-powder-shot.generated.ts";

export const dryPowderShot = definePitchFamily(fabPitchFamilies["dry-powder-shot"], {
  abilities: () => ({
    whenIsPutFaceUpIntoArsenalGets2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
          to: "arsenal",
          faceDown: false,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});
export const { red: dryPowderShotRed } = dryPowderShot.cards;
