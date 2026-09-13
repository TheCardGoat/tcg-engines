import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { captainSCall } from "./captain-s-call.ts";

export const captainSCallI18n = defineFamilyI18n(captainSCall, {
  en: {
    name: "Captain's Call",
    typeText: "Generic Action",
    text: ({ costLimit, powerBonus }) =>
      `Choose 1;\nThe next attack action card with cost ${costLimit} or less you play this turn gains +${powerBonus}{p}.\nThe next attack action card with cost ${costLimit} or less you play this turn gains go again.\nGo again`,
  },
});

export const {
  red: captainSCallRedI18n,
  yellow: captainSCallYellowI18n,
  blue: captainSCallBlueI18n,
} = captainSCallI18n.cards;
