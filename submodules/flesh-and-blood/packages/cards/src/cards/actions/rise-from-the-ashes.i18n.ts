import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riseFromTheAshes } from "./rise-from-the-ashes.ts";

export const riseFromTheAshesI18n = defineFamilyI18n(riseFromTheAshes, {
  en: {
    name: "Rise from the Ashes",
    text: ({ value1 }) =>
      `The next Draconic or Ninja attack action card you play this turn gains +${value1}{p}.
You may return a Phoenix Flame from your graveyard to your hand.
Go again`,
    typeText: "Draconic Ninja Action",
  },
});

export const {
  red: riseFromTheAshesRedI18n,
  yellow: riseFromTheAshesYellowI18n,
  blue: riseFromTheAshesBlueI18n,
} = riseFromTheAshesI18n.cards;
