import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soulBondBelief } from "./soul-bond-belief.ts";

export const soulBondBeliefI18n = defineFamilyI18n(soulBondBelief, {
  en: {
    name: "Soul Bond Belief",
    typeText: "Light Action - Attack",
    text: "When this attacks, reveal the top card of your deck. If it's yellow, put it into your soul and this gets +1{p}.",
  },
});

export const {
  red: soulBondBeliefRedI18n,
  yellow: soulBondBeliefYellowI18n,
  blue: soulBondBeliefBlueI18n,
} = soulBondBeliefI18n.cards;
