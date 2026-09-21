import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/codex-of-frailty.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const codexOfFrailty = definePitchFamily(fabPitchFamilies["codex-of-frailty"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroPutsAttackActionFromTheirGraveyardFace: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "if-you-do",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["graveyard"],
              filter: attackActionFilter(),
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-down",
            },
          },
          then: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["hand"],
              count: 1,
            },
          },
        },
      },
    },
    createPonderTokenUnderControlFrailtyTokenUnderEach: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "ponder",
            controller: "controller",
          },
          {
            type: "create-token",
            token: "frailty",
            creator: "effect-controller",
            controller: "opponent",
          },
        ],
      },
    },
  }),
});
export const { yellow: codexOfFrailtyYellow } = codexOfFrailty.cards;
