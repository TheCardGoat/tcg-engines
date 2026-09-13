import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { storyBeats } from "./story-beats.ts";

export const storyBeatsI18n = defineFamilyI18n(storyBeats, {
  en: {
    name: "Story Beats",
    text: "When this attacks or defends, you may put a suspense counter on, or remove one from, an aura of suspense you control.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: storyBeatsRedI18n,
  yellow: storyBeatsYellowI18n,
  blue: storyBeatsBlueI18n,
} = storyBeatsI18n.cards;
