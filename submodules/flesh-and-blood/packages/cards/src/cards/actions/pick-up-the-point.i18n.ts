import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pickUpThePoint } from "./pick-up-the-point.ts";

export const pickUpThePointI18n = defineFamilyI18n(pickUpThePoint, {
  en: {
    name: "Pick Up the Point",
    text: "When this attacks, you may retrieve a dagger from your graveyard.\nGo again",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: pickUpThePointRedI18n,
  yellow: pickUpThePointYellowI18n,
  blue: pickUpThePointBlueI18n,
} = pickUpThePointI18n.cards;
