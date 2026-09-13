import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { offBeat } from "./off-beat.ts";

export const offBeatI18n = defineFamilyI18n(offBeat, {
  en: {
    name: "Off Beat",
    typeText: "Warrior Action",
    text: "Destroy up to 1 Blade Dance and/or Flurry token. Sharpen target sword you control for each token destroyed this way.\nGo again",
  },
});

export const { blue: offBeatBlueI18n } = offBeatI18n.cards;
