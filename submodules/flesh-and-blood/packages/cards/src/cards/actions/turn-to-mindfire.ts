import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/turn-to-mindfire.generated.ts";

/** Model notes (hand-authored): printed target is any hero, matching other arcane bolts. */
export const turnToMindfire = definePitchFamily(fabPitchFamilies["turn-to-mindfire"], {
  abilities: () => ({
    dealNumber5ArcaneDamageAny: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 5,
        target: {
          selector: "any-hero",
        },
      },
    },
    dealsDamageTHeroDoCreatePonderToken: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "this-dealt-damage",
      },
      effect: {
        type: "optional",
        effect: {
          type: "tap",
          target: {
            selector: "controller",
          },
        },
        then: {
          type: "create-token",
          token: "ponder",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: turnToMindfireRed } = turnToMindfire.cards;
