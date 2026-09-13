import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { destructiveFleetfoot } from "./destructive-fleetfoot.ts";

export const destructiveFleetfootI18n = defineFamilyI18n(destructiveFleetfoot, {
  en: {
    name: "Destructive Fleetfoot",
    text: "Quickstrike - If this has go again, it gets +1{p}.\nWhen this hits a hero, destroy an aura token they control.",
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: destructiveFleetfootRedI18n,
  yellow: destructiveFleetfootYellowI18n,
  blue: destructiveFleetfootBlueI18n,
} = destructiveFleetfootI18n.cards;
