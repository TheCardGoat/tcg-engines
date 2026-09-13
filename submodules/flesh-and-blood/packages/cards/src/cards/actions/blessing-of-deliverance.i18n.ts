import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfDeliverance } from "./blessing-of-deliverance.ts";

export const blessingOfDeliveranceI18n = defineFamilyI18n(blessingOfDeliverance, {
  en: {
    name: "Blessing of Deliverance",
    text: (amount) => `Go again
When Blessing of Deliverance enters the arena, if you have a card with cost 3 or greater in your pitch zone, draw a card.
At the beginning of your action phase, destroy Blessing of Deliverance then reveal the top ${amount} cards of your deck. Gain 1{h} for each card with cost 3 or greater revealed this way.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: blessingOfDeliveranceRedI18n,
  yellow: blessingOfDeliveranceYellowI18n,
  blue: blessingOfDeliveranceBlueI18n,
} = blessingOfDeliveranceI18n.cards;
