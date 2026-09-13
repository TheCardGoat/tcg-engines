import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { trapAndRelease } from "./trap-and-release.ts";

export const trapAndReleaseI18n = defineFamilyI18n(trapAndRelease, {
  en: {
    name: "Trap and Release",
    text: "When this hits a hero, mark them.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: trapAndReleaseRedI18n,
  yellow: trapAndReleaseYellowI18n,
  blue: trapAndReleaseBlueI18n,
} = trapAndReleaseI18n.cards;
