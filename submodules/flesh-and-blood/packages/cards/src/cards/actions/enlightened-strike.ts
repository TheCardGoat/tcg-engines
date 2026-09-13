import { semanticModalAbility } from "../../authoring/card.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/enlightened-strike.generated.ts";

/** Model notes (hand-authored): go again is only modal choice 3, not a static keyword. */
export const enlightenedStrike = definePitchFamily(fabPitchFamilies["enlightened-strike"], {
  keywords: [],
  abilities: () => ({
    asAdditionalCostPlayEnlightenedStrikePutFromHand: semanticModalAbility({
      kind: "modal",
      modal: {
        choose: 1,
      },
      modes: {
        whenAttackEnlightenedStrikeDraw: {
          kind: "resolution",
          effect: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "source", selector: "attack" },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-chain-link",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          },
        },
        enlightenedStrikeGains2: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
        enlightenedStrikeGainsGoAgain: {
          kind: "resolution",
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
      },
      additionalCost: {
        class: "effect",
        type: "move-to-deck",
        from: "hand",
        position: "bottom",
        count: 1,
      },
    }),
  }),
});
export const { red: enlightenedStrikeRed } = enlightenedStrike.cards;
