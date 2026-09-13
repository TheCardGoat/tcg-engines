import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ripThroughReality } from "./rip-through-reality.ts";

export const ripThroughRealityI18n = defineFamilyI18n(ripThroughReality, {
  en: {
    name: "Rip Through Reality",
    text: "You may play Rip Through Reality from your banished zone.\nIf you have dealt arcane damage to an opposing hero this turn, Rip Through Reality gains go again.\nBlood Debt",
    typeText: "Shadow Runeblade Action - Attack",
  },
});

export const {
  red: ripThroughRealityRedI18n,
  yellow: ripThroughRealityYellowI18n,
  blue: ripThroughRealityBlueI18n,
} = ripThroughRealityI18n.cards;
