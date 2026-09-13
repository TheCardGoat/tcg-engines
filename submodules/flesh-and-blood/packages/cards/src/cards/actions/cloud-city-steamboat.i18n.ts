import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cloudCitySteamboat } from "./cloud-city-steamboat.ts";

export const cloudCitySteamboatI18n = defineFamilyI18n(cloudCitySteamboat, {
  en: {
    name: "Cloud City Steamboat",
    text: "When this hits a hero, you may {t} a cog you control. If you do, put a steam counter on a cog you control.\nTwice per Turn Instant - {t} a cog you control: This gets +1{p}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: cloudCitySteamboatRedI18n,
  yellow: cloudCitySteamboatYellowI18n,
  blue: cloudCitySteamboatBlueI18n,
} = cloudCitySteamboatI18n.cards;
