import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { weaveLightning } from "./weave-lightning.ts";

export const weaveLightningI18n = defineFamilyI18n(weaveLightning, {
  en: {
    name: "Weave Lightning",
    text: "The next Lightning or Elemental attack action card you play this turn gains +3{p}. If it's fused, it gains go again.\nGo again",
    typeText: "Lightning Action",
  },
});
export const {
  red: weaveLightningRedI18n,
  yellow: weaveLightningYellowI18n,
  blue: weaveLightningBlueI18n,
} = weaveLightningI18n.cards;
