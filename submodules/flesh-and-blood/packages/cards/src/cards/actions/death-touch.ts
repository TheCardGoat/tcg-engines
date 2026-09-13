import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/death-touch.generated.ts";

export const deathTouch = definePitchFamily(fabPitchFamilies["death-touch"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  abilities: () => ({
    playFromOutsideHand: {
      kind: "static",
      staticKind: "play",

      condition: {
        type: "not",
        condition: {
          type: "played-this",
          per: "turn",
          onlySource: true,
          filter: { playedFromZones: ["hand"] },
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    createAfflictionOnHit: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "choose-and-create-token",
          options: ["frailty", "inertia", "bloodrot-pox"],
          // CR 1.11: the ability's controller (the attacker) chooses; the
          // token is merely created under the hit hero's control.
          chooser: "controller",
          controller: "attack-target",
        },
      },
    },
  }),
});

export const {
  red: deathTouchRed,
  yellow: deathTouchYellow,
  blue: deathTouchBlue,
} = deathTouch.cards;
