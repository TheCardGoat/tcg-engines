import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingAftermath } from "./consuming-aftermath.ts";

export const consumingAftermathI18n = defineFamilyI18n(consumingAftermath, {
  en: {
    name: "Consuming Aftermath",
    text: "As an additional cost to play Consuming Aftermath, you may banish a card from your hand. If a Shadow card is banished this way, Consuming Aftermath gains dominate.",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: consumingAftermathRedI18n,
  yellow: consumingAftermathYellowI18n,
  blue: consumingAftermathBlueI18n,
} = consumingAftermathI18n.cards;
