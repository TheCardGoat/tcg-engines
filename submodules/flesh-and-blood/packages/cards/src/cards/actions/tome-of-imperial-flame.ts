import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-imperial-flame.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tomeOfImperialFlame = definePitchFamily(fabPitchFamilies["tome-of-imperial-flame"], {
  keywords: [goAgain],
  abilities: () => ({
    drawRoyalInsteadDrawNumber2: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "self-replacement",
            condition: {
              type: "has-status",
              status: "hero-is-royal",
            },
            modification: {
              type: "draw",
              count: 2,
              player: "controller",
            },
          },
        ],
      },
    },
    pitchNumber2RedDonTBanishHand: {
      kind: "resolution",
      effect: {
        type: "unless",
        effect: {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: {
              type: "all",
            },
          },
        },
        escape: {
          type: "optional",
          effect: {
            type: "pitch-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                color: ["red"],
              },
              count: 2,
            },
          },
        },
      },
    },
  }),
});

export const { red: tomeOfImperialFlameRed } = tomeOfImperialFlame.cards;
