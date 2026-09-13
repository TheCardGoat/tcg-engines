import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seek-enlightenment.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const seekEnlightenment = definePitchFamily(fabPitchFamilies["seek-enlightenment"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: powerBonus,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "triggeredStaticOnHitEffect",
                text: "",
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
                      zone: "soul",
                    },
                  },
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  }),
});

export const {
  red: seekEnlightenmentRed,
  yellow: seekEnlightenmentYellow,
  blue: seekEnlightenmentBlue,
} = seekEnlightenment.cards;
