import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mark-of-the-black-widow.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  triggeredHitBanish: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "event-object",
          selector: "attack",
          relationship: {
            kind: "any",
          },
          filter: {
            hasStatus: "marked",
          },
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hand"],
          count: 1,
        },
      },
    },
  },
} as const;

export const markOfTheBlackWidow = definePitchFamily(fabPitchFamilies["mark-of-the-black-widow"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: markOfTheBlackWidowRed,
  yellow: markOfTheBlackWidowYellow,
  blue: markOfTheBlackWidowBlue,
} = markOfTheBlackWidow.cards;
