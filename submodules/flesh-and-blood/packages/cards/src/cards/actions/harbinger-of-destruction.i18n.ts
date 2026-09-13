import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { harbingerOfDestruction } from "./harbinger-of-destruction.ts";

export const harbingerOfDestructionI18n = defineFamilyI18n(harbingerOfDestruction, {
  en: {
    name: "Harbinger of Destruction",
    typeText: "Shadow Action - Attack",
    text: 'As an additional cost to play this, banish a card from your hand. If a Shadow card was banished this way, this gets "When this hits, create 2 Gate to i\'Arathael tokens."\nBlood Debt',
  },
});

export const { red: harbingerOfDestructionRedI18n } = harbingerOfDestructionI18n.cards;
