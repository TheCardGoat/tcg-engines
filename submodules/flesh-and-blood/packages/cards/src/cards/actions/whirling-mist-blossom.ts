import { compareAmount } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/whirling-mist-blossom.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const whirlingMistBlossom = definePitchFamily(fabPitchFamilies["whirling-mist-blossom"], {
  keywords: [
    {
      name: "specialization",
      hero: "Ira",
    },
    goAgain,
  ],
  abilities: () => ({
    whenHitsSSecondHigherChainLinkInRowHitDrawNumber2: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: compareAmount(
          { type: "count", what: "consecutive-chain-links-that-hit" },
          { op: "gte", value: 2 },
        ),
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 2,
          player: "controller",
        },
      },
    },
  }),
});

export const { yellow: whirlingMistBlossomYellow } = whirlingMistBlossom.cards;
