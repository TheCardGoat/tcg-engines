import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pursue-to-the-pits-of-despair.generated.ts";

export const pursueToThePitsOfDespair = definePitchFamily(
  fabPitchFamilies["pursue-to-the-pits-of-despair"],
  {
    abilities: () => ({
      hitsMark: {
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
            type: "mark",
            target: {
              selector: "attack-target",
            },
          },
        },
        label: {
          name: "mark",
        },
      },
    }),
  },
);

export const { red: pursueToThePitsOfDespairRed } = pursueToThePitsOfDespair.cards;
