import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ramRaider } from "./ram-raider.ts";

export const ramRaiderI18n = defineFamilyI18n(ramRaider, {
  en: {
    name: "Ram Raider",
    text: "As an additional cost to play this, banish a random card from your hand. If a card with 6 or more {p} is banished this way, this gets go again.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: ramRaiderRedI18n,
  yellow: ramRaiderYellowI18n,
  blue: ramRaiderBlueI18n,
} = ramRaiderI18n.cards;
