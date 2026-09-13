import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodfrenzyGloomblade } from "./bloodfrenzy-gloomblade.ts";

export const bloodfrenzyGloombladeI18n = defineFamilyI18n(bloodfrenzyGloomblade, {
  en: {
    name: "Bloodfrenzy Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: "You may play this from your banished zone.\nUsurp\nIf you've dealt damage to the defending hero this turn, this gets go again.\nBlood Debt",
  },
});

export const {
  red: bloodfrenzyGloombladeRedI18n,
  yellow: bloodfrenzyGloombladeYellowI18n,
  blue: bloodfrenzyGloombladeBlueI18n,
} = bloodfrenzyGloombladeI18n.cards;
