import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { upSticksAndRun } from "./up-sticks-and-run.ts";

export const upSticksAndRunI18n = defineFamilyI18n(upSticksAndRun, {
  en: {
    name: "Up Sticks and Run",
    text: ({ value1 }) =>
      `You may retrieve a dagger from your graveyard.
Your next dagger attack this turn gets +${value1}{p}.
Go again`,
    typeText: "Assassin / Ninja Action",
  },
});

export const {
  red: upSticksAndRunRedI18n,
  yellow: upSticksAndRunYellowI18n,
  blue: upSticksAndRunBlueI18n,
} = upSticksAndRunI18n.cards;
