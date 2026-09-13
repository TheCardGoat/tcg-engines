import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ironsongResponse } from "./ironsong-response.ts";

export const ironsongResponseI18n = defineFamilyI18n(ironsongResponse, {
  en: {
    name: "Ironsong Response",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `If the defending hero has defended with a card from their hand this chain link, target weapon attack gains +${amount}{p}.`,
  },
});
export const {
  red: ironsongResponseRedI18n,
  yellow: ironsongResponseYellowI18n,
  blue: ironsongResponseBlueI18n,
} = ironsongResponseI18n.cards;
