import { plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heavy-swing.generated.ts";

export const heavySwing = definePitchFamily(fabPitchFamilies["heavy-swing"], {
  abilities: () => ({
    startOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "destroy", target: { selector: "self" } },
            plusPower(3, { appliesTo: { next: { typeBox: { subtypes: ["Sword"] } } } }),
          ],
        },
      },
    },
  }),
});

export const { red: heavySwingRed } = heavySwing.cards;
