import { onHit } from "@tcg/flesh-and-blood-types";
import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/devouring-doomwake.generated.ts";

export const devouringDoomwake = definePitchFamily(fabPitchFamilies["devouring-doomwake"], {
  keywords: [bloodDebt],
  abilities: () => ({
    onHitBanishSelfAndDefendingCards: onHit({
      type: "sequence",
      steps: [
        {
          type: "banish",
          target: {
            selector: "self",
          },
        },
        {
          type: "banish",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["combat-chain"],
            filter: { defending: true },
            count: { type: "all" },
          },
        },
      ],
    }),
  }),
});

export const { red: devouringDoomwakeRed } = devouringDoomwake.cards;
