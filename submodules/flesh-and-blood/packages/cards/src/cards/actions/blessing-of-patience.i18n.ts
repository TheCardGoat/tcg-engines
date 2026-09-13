import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfPatience } from "./blessing-of-patience.ts";

export const blessingOfPatienceI18n = defineFamilyI18n(blessingOfPatience, {
  en: {
    name: "Blessing of Patience",
    text: (amount) =>
      `At the start of your turn, destroy Blessing of Patience then target hero gains ${amount}{h}.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: blessingOfPatienceRedI18n,
  yellow: blessingOfPatienceYellowI18n,
  blue: blessingOfPatienceBlueI18n,
} = blessingOfPatienceI18n.cards;
