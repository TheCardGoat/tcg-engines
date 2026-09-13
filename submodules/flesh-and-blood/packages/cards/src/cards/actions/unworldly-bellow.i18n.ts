import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { unworldlyBellow } from "./unworldly-bellow.ts";

export const unworldlyBellowI18n = defineFamilyI18n(unworldlyBellow, {
  en: {
    name: "Unworldly Bellow",
    text: ({
      powerBonus,
    }) => `As an additional cost to play Unworldly Bellow, banish 3 random cards from your graveyard.
The next Brute or Shadow attack action card you play this turn gains +${powerBonus}{p}.
Go again`,
    typeText: "Shadow Brute Action",
  },
});

export const {
  red: unworldlyBellowRedI18n,
  yellow: unworldlyBellowYellowI18n,
  blue: unworldlyBellowBlueI18n,
} = unworldlyBellowI18n.cards;
