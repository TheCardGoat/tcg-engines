import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodsongGloomblade } from "./bloodsong-gloomblade.ts";

export const bloodsongGloombladeI18n = defineFamilyI18n(bloodsongGloomblade, {
  en: {
    name: "Bloodsong Gloomblade",
    typeText: "Shadow Runeblade Action - Attack",
    text: "You may play this from your banished zone.\nUsurp\nWhen this hits a hero, you may banish target aura permanent they control.\nBlood Debt",
  },
});

export const { red: bloodsongGloombladeRedI18n } = bloodsongGloombladeI18n.cards;
