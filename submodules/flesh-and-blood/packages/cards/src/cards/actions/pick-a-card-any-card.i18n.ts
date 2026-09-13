import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pickACardAnyCard } from "./pick-a-card-any-card.ts";

export const pickACardAnyCardI18n = defineFamilyI18n(pickACardAnyCard, {
  en: {
    name: "Pick a Card, Any Card",
    typeText: "Generic Action",
    text: ({ times }) =>
      `Look at target opponent's hand then name a card.\nChoose a random card from their hand and reveal it. If it's the named card, create a Silver token. Repeat this process ${times === 1 ? "once" : times === 2 ? "twice" : "thrice"}.\nGo again`,
  },
});

export const {
  red: pickACardAnyCardRedI18n,
  yellow: pickACardAnyCardYellowI18n,
  blue: pickACardAnyCardBlueI18n,
} = pickACardAnyCardI18n.cards;
