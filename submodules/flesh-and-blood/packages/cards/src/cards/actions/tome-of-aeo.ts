import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-aeo.generated.ts";
import { ward } from "../shared/keywords.ts";

export const tomeOfAeo = definePitchFamily(fabPitchFamilies["tome-of-aeo"], {
  keywords: [ward(1)],
  abilities: () => ({
    atBeginningActionPhaseDestroyTomeAeoDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: tomeOfAeoBlue } = tomeOfAeo.cards;
