import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { goldenCompany } from "./golden-company.ts";

export const goldenCompanyI18n = defineFamilyI18n(goldenCompany, {
  en: {
    name: "Golden Company",
    text: "You may destroy a Gold you control rather than pay this card's {r} cost.",
    typeText: "Warrior Defense Reaction",
  },
});

export const {
  red: goldenCompanyRedI18n,
  yellow: goldenCompanyYellowI18n,
  blue: goldenCompanyBlueI18n,
} = goldenCompanyI18n.cards;
