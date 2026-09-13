import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pursue-to-the-edge-of-oblivion.generated.ts";

export const pursueToTheEdgeOfOblivion = definePitchFamily(
  fabPitchFamilies["pursue-to-the-edge-of-oblivion"],
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

export const { red: pursueToTheEdgeOfOblivionRed } = pursueToTheEdgeOfOblivion.cards;
