import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/horrors-of-the-past.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const horrorsOfThePast = definePitchFamily(fabPitchFamilies["horrors-of-the-past"], {
  keywords: [stealth],
  abilities: () => ({
    attacksGetsBaseAbilitiesLastAttackActionStealthCombatChain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "copy",
          target: {
            selector: "self",
          },
          source: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["combat-chain"],
            position: "top",
            filter: attackActionFilter({ hasKeyword: "stealth" }),
            count: 1,
          },
          duration: "this-turn",
          abilitiesOnly: true,
        },
      },
    },
  }),
});

export const { yellow: horrorsOfThePastYellow } = horrorsOfThePast.cards;
