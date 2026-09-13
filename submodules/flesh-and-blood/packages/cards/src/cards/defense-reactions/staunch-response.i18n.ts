import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { staunchResponse } from "./staunch-response.ts";

export const staunchResponseI18n = defineFamilyI18n(staunchResponse, {
  en: {
    name: "Staunch Response",
    text: "As an additional cost to play Staunch Response you may pay {r}{r}{r}{r}. If you do, Staunch Response gains +3{d}.",
    typeText: "Guardian Defense Reaction",
  },
});

export const {
  red: staunchResponseRedI18n,
  yellow: staunchResponseYellowI18n,
  blue: staunchResponseBlueI18n,
} = staunchResponseI18n.cards;
