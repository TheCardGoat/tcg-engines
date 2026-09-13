import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pathOfSameEnds } from "./path-of-same-ends.ts";

export const pathOfSameEndsI18n = defineFamilyI18n(pathOfSameEnds, {
  en: {
    name: "Path of Same Ends",
    text: "When this attacks a hero, deal 1 arcane damage to them. If damage is dealt this way, this gets go again.\nInstant - {r}: This gets go again.",
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: pathOfSameEndsRedI18n,
  yellow: pathOfSameEndsYellowI18n,
  blue: pathOfSameEndsBlueI18n,
} = pathOfSameEndsI18n.cards;
