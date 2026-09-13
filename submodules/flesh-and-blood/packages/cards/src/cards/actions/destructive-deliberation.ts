import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/destructive-deliberation.generated.ts";

export const destructiveDeliberation = definePitchFamily(
  fabPitchFamilies["destructive-deliberation"],
  {
    abilities: () => ({
      createPonder: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "attack" },
            target: { kind: "hero" },
          },
        },
        resolution: {
          kind: "effect",
          effect: { type: "create-token", token: "ponder", controller: "controller" },
        },
      },
    }),
  },
);

export const {
  red: destructiveDeliberationRed,
  yellow: destructiveDeliberationYellow,
  blue: destructiveDeliberationBlue,
} = destructiveDeliberation.cards;
