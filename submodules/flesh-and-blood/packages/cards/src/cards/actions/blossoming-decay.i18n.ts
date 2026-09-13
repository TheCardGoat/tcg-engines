import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blossomingDecay } from "./blossoming-decay.ts";

export const blossomingDecayI18n = defineFamilyI18n(blossomingDecay, {
  en: {
    name: "Blossoming Decay",
    text: "Decompose - When this attacks, you may banish 2 Earth cards and an action card from your graveyard. If you do, gain 1{h}.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: blossomingDecayRedI18n,
  yellow: blossomingDecayYellowI18n,
  blue: blossomingDecayBlueI18n,
} = blossomingDecayI18n.cards;
