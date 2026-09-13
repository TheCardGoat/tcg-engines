import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { razorSEdge } from "./razor-s-edge.ts";

export const razorSEdgeI18n = defineFamilyI18n(razorSEdge, {
  en: {
    name: "Razor's Edge",
    typeText: "Assassin Attack Reaction",
    text: (amount) => `Target attack action card with stealth gets +${amount}{p}.`,
  },
});
export const {
  red: razorSEdgeRedI18n,
  yellow: razorSEdgeYellowI18n,
  blue: razorSEdgeBlueI18n,
} = razorSEdgeI18n.cards;
