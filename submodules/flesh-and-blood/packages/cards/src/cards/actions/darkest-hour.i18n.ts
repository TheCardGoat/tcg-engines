import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { darkestHour } from "./darkest-hour.ts";
const textByColor = {
  red: "You may put a card from your hand on top of your deck rather than pay this card's {r} cost.\nYour next Shadow attack this turn gets +4{p}. Go again\nBlood Debt",
  yellow:
    "You may put a card from your hand on top of your deck rather than pay this card's {r} cost.\nYour next Shadow attack this turn gets +3{p}. Go again\nBlood Debt",
  blue: "You may put a card from your hand on top of your deck rather than pay this card's {r} cost.\nYour next Shadow attack this turn gets +1{p}. Go again\nBlood Debt",
} as const;
export const darkestHourI18n = defineFamilyI18n(darkestHour, {
  en: {
    name: "Darkest Hour",
    typeText: "Shadow Action",
    text: (_parameter, color) => textByColor[color],
  },
});
export const {
  red: darkestHourRedI18n,
  yellow: darkestHourYellowI18n,
  blue: darkestHourBlueI18n,
} = darkestHourI18n.cards;
