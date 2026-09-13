import { createToken, grantKeyword } from "@tcg/flesh-and-blood-types";
import { bloodDebt, goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rumbling-hunger.generated.ts";

export const rumblingHunger = definePitchFamily(fabPitchFamilies["rumbling-hunger"], {
  keywords: [bloodDebt],

  abilities: () => ({
    onHitCreateBlasmophetAndGoAgain: {
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
        },
      },
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            createToken("blasmophet-the-insatiable-hunger"),
            grantKeyword(goAgain, { target: { selector: "self" } }),
          ],
        },
      },
    },
  }),
});

export const {
  red: rumblingHungerRed,
  yellow: rumblingHungerYellow,
  blue: rumblingHungerBlue,
} = rumblingHunger.cards;
