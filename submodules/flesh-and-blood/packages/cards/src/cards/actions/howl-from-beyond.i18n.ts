import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { howlFromBeyond } from "./howl-from-beyond.ts";

export const howlFromBeyondI18n = defineFamilyI18n(howlFromBeyond, {
  en: {
    name: "Howl from Beyond",
    text: ({ value1 }) => `You may play Howl from Beyond from your banished zone.
The next attack action card you play this turn gains +${value1}{p}.
Go again
Blood Debt`,
    typeText: "Shadow Action",
  },
});

export const {
  red: howlFromBeyondRedI18n,
  yellow: howlFromBeyondYellowI18n,
  blue: howlFromBeyondBlueI18n,
} = howlFromBeyondI18n.cards;
