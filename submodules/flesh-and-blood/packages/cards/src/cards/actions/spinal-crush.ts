import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spinal-crush.generated.ts";
import { goAgain } from "../shared/keywords.ts";

/** Action cards / attacks the damaged hero controls — live set, not a snapshot. */
const theirActionsAndAttacks = {
  selector: "object" as const,
  declared: "at-resolution" as const,
  player: "opponent" as const,
  zones: ["stack", "combat-chain"] as const,
  filter: {
    or: [
      { typeBox: { types: ["Action"] as const } },
      { typeBox: { subtypes: ["Attack"] as const } },
    ],
  },
  count: { type: "all" as const },
};

/** Model notes: lose + can't-gain go again applies only during their next action phase. */
export const spinalCrush = definePitchFamily(fabPitchFamilies["spinal-crush"], {
  abilities: () => ({
    crushAbility: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: theirActionsAndAttacks,
            duration: "during-their-next-action-phase",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "gain-keyword",
            keyword: "go-again",
            subject: theirActionsAndAttacks,
            duration: "during-their-next-action-phase",
          },
        ],
      },
    }),
  }),
});

export const { red: spinalCrushRed } = spinalCrush.cards;
