import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { embolden } from "./embolden.ts";

export const emboldenI18n = defineFamilyI18n(embolden, {
  en: {
    name: "Embolden",
    text: (amount) => `Go again
When this enters the arena, if you control another non-token aura, draw a card.
At the beginning of your action phase, destroy this, then the next Guardian attack action card you play this turn gets +${amount}{p}.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: emboldenRedI18n,
  yellow: emboldenYellowI18n,
  blue: emboldenBlueI18n,
} = emboldenI18n.cards;
