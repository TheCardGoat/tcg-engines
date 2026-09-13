import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/savage-feast.generated.ts";

export const savageFeast = definePitchFamily(fabPitchFamilies["savage-feast"], {
  abilities: () => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          random: true,
        },
      },
    },
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "performed-this-turn",
          event: "discard-power-6-for-cost",
          player: "controller",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});

export const {
  red: savageFeastRed,
  yellow: savageFeastYellow,
  blue: savageFeastBlue,
} = savageFeast.cards;
