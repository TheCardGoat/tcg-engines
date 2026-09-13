import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { publicBounty } from "./public-bounty.ts";

export const publicBountyI18n = defineFamilyI18n(publicBounty, {
  en: {
    name: "Public Bounty",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `Mark target opposing hero.\nThe next time you attack a marked hero this turn, the attack gets +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: publicBountyRedI18n,
  yellow: publicBountyYellowI18n,
  blue: publicBountyBlueI18n,
} = publicBountyI18n.cards;
