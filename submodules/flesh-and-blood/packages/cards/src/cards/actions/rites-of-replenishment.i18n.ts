import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ritesOfReplenishment } from "./rites-of-replenishment.ts";

export const ritesOfReplenishmentI18n = defineFamilyI18n(ritesOfReplenishment, {
  en: {
    name: "Rites of Replenishment",
    text: "Earth Fusion\nWhen you attack with Rites of Replenishment, if you have dealt arcane damage this turn, you may put a 'non-attack' action card from your graveyard on the bottom of your deck.\nWhen you attack with Rites of Replenishment, if it was fused, you may put an attack action card from your graveyard on the bottom of your deck.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: ritesOfReplenishmentRedI18n,
  yellow: ritesOfReplenishmentYellowI18n,
  blue: ritesOfReplenishmentBlueI18n,
} = ritesOfReplenishmentI18n.cards;
