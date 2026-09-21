import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sigil-of-the-muse.generated.ts";
export const sigilOfTheMuse = definePitchFamily(fabPitchFamilies["sigil-of-the-muse"], {
  abilities: () => ({
    replaceDraws: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "phase-is", phase: "action" },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: { name: "draw" },
        modification: {
          type: "create-token",
          token: "ponder",
          creator: "token-controller",
          controller: "target-controller",
          count: { type: "event-amount" },
        },
        duration: "while-in-arena",
      },
    },
    nextActionPhase: {
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
            { type: "create-token", token: "ponder", controller: "controller", count: 1 },
          ],
        },
      },
    },
  }),
});
export const { red: sigilOfTheMuseRed } = sigilOfTheMuse.cards;
