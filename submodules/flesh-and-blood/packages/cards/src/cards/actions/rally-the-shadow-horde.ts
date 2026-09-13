import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rally-the-shadow-horde.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const rallyTheShadowHorde = definePitchFamily(fabPitchFamilies["rally-the-shadow-horde"], {
  keywords: [bloodDebt],
  abilities: () => ({
    oncePerTurnInstantBanishFromHandPlusDefense: {
      kind: "activated",
      limit: { count: 1, per: "turn" },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "banish",
        from: "hand",
        count: 1,
      },
      condition: {
        type: "has-status",
        status: "this-is-defending",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: rallyTheShadowHordeRed,
  yellow: rallyTheShadowHordeYellow,
  blue: rallyTheShadowHordeBlue,
} = rallyTheShadowHorde.cards;
