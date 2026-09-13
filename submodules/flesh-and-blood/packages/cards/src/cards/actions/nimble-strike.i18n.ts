import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { nimbleStrike } from "./nimble-strike.ts";

export const nimbleStrikeI18n = defineFamilyI18n(nimbleStrike, {
  en: {
    name: "Nimble Strike",
    text: "As an additional cost to play Nimble Strike, you may banish a card named Nimblism from your graveyard. If you do, Nimble Strike gain +1{p} and go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: nimbleStrikeRedI18n,
  yellow: nimbleStrikeYellowI18n,
  blue: nimbleStrikeBlueI18n,
} = nimbleStrikeI18n.cards;
