import { nextAttackAction, onHit, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/warmonger-s-recital.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const warmongerSRecital = definePitchFamily(fabPitchFamilies["warmonger-s-recital"], {
  parameters: pitchMap({
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    empowerNextAttack: {
      type: "sequence",
      steps: [
        nextAttackAction({ grant: plusPower(powerBonus) }),
        nextAttackAction({
          grant: {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                ...onHit({
                  type: "move-card",
                  target: { selector: "self" },
                  to: { zone: "deck", player: "owner", position: "bottom" },
                }),
                id: "effect",
                text: "",
              },
            },
            duration: "this-turn",
          },
        }),
      ],
    },
  }),
});

export const {
  red: warmongerSRecitalRed,
  yellow: warmongerSRecitalYellow,
  blue: warmongerSRecitalBlue,
} = warmongerSRecital.cards;
