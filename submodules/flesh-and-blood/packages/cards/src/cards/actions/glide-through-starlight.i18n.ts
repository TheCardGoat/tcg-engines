import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { glideThroughStarlight } from "./glide-through-starlight.ts";

export const glideThroughStarlightI18n = defineFamilyI18n(glideThroughStarlight, {
  en: {
    name: "Glide Through Starlight",
    typeText: "Lightning Action - Attack",
    text: "Instant - {r}, discard this: Prevent the next 1 damage that would be dealt to you this turn. If you prevent damage this way, create a Lightning Flow token.",
  },
});

export const {
  red: glideThroughStarlightRedI18n,
  yellow: glideThroughStarlightYellowI18n,
  blue: glideThroughStarlightBlueI18n,
} = glideThroughStarlightI18n.cards;
