import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strategicPlanning } from "./strategic-planning.ts";

export const strategicPlanningI18n = defineFamilyI18n(strategicPlanning, {
  en: {
    name: "Strategic Planning",
    typeText: "Generic Action",
    text: ({ costLimit }) =>
      `Put an action card with cost ${costLimit} or less from a graveyard on the bottom of its owner's deck. At the beginning of the end phase, draw a card.\nGo again`,
  },
});

export const {
  red: strategicPlanningRedI18n,
  yellow: strategicPlanningYellowI18n,
  blue: strategicPlanningBlueI18n,
} = strategicPlanningI18n.cards;
