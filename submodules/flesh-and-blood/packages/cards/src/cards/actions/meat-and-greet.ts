import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meat-and-greet.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const meatAndGreet = definePitchFamily(fabPitchFamilies["meat-and-greet"], {
  // No printed keyword line: go again is conditional on having dealt arcane
  // damage to an opposing hero this turn (a2, CR 7.6.2). An authored
  // `keywords: [goAgain]` made the refund unconditional (W1-FIX, plan §5).
  abilities: () => ({
    triggeredHitCreateTokenRunechant: {
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
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
    performedThisTurnDealArcaneDamageGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "deal-arcane-damage",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: meatAndGreetRed,
  yellow: meatAndGreetYellow,
  blue: meatAndGreetBlue,
} = meatAndGreet.cards;
