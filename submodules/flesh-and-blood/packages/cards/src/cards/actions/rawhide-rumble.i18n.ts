import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rawhideRumble } from "./rawhide-rumble.ts";

export const rawhideRumbleI18n = defineFamilyI18n(rawhideRumble, {
  en: {
    name: "Rawhide Rumble",
    text: "Beat Chest\nWhen this attacks a hero, if you've beaten chest this turn, intimidate them.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: rawhideRumbleRedI18n,
  yellow: rawhideRumbleYellowI18n,
  blue: rawhideRumbleBlueI18n,
} = rawhideRumbleI18n.cards;
