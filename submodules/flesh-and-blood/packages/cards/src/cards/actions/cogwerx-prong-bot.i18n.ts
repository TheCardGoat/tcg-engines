import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cogwerxProngBot } from "./cogwerx-prong-bot.ts";

export const cogwerxProngBotI18n = defineFamilyI18n(cogwerxProngBot, {
  en: {
    name: "Cogwerx Prong Bot",
    typeText: "Mechanologist Action - Attack",
    text: "When this hits a hero, you may put a steam counter on an item you control with crank.\nInstant - {r}, discard this: Create a Golden Cog token.",
  },
});

export const { yellow: cogwerxProngBotYellowI18n } = cogwerxProngBotI18n.cards;
