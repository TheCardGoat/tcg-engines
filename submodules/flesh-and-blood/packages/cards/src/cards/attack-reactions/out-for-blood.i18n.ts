import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { outForBlood } from "./out-for-blood.ts";

export const outForBloodI18n = defineFamilyI18n(outForBlood, {
  en: {
    name: "Out for Blood",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target weapon attack gains +${amount}{p}.\nReprise - If the defending hero has defended with a card from their hand this chain link, your next attack this turn gains +1{p}.`,
  },
});
export const {
  red: outForBloodRedI18n,
  yellow: outForBloodYellowI18n,
  blue: outForBloodBlueI18n,
} = outForBloodI18n.cards;
