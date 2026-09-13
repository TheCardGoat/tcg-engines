import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { viralDiffusion } from "./viral-diffusion.ts";

export const viralDiffusionI18n = defineFamilyI18n(viralDiffusion, {
  en: {
    name: "Viral Diffusion",
    typeText: "Assassin Defense Reaction - Trap",
    text: "Mortimer Specialization\nWhen this defends, create a Frailty, Inertia, and Bloodrot Pox token under the attacking hero's control.",
  },
});

export const { red: viralDiffusionRedI18n } = viralDiffusionI18n.cards;
