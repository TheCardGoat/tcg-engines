import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { corpseCover } from "./corpse-cover.ts";

export const corpseCoverI18n = defineFamilyI18n(corpseCover, {
  en: {
    name: "Corpse Cover",
    typeText: "Necromancer Block",
    text: "Once per Turn Instant - Destroy an ally you control or discard an ally: Prevent the next 2 damage that would be dealt to you this turn. Activate this only while this card is defending.",
  },
});

export const {
  red: corpseCoverRedI18n,
  yellow: corpseCoverYellowI18n,
  blue: corpseCoverBlueI18n,
} = corpseCoverI18n.cards;
