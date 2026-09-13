import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { buzzsawTrap } from "./buzzsaw-trap.ts";

export const buzzsawTrapI18n = defineFamilyI18n(buzzsawTrap, {
  en: {
    name: "Buzzsaw Trap",
    text: "Legendary Riptide Specialization\nWhen this defends an attack with {p} greater than its base, the attack can't gain {p} this turn.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { blue: buzzsawTrapBlueI18n } = buzzsawTrapI18n.cards;
