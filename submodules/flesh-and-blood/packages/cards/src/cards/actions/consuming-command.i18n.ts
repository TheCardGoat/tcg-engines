import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingCommand } from "./consuming-command.ts";

export const consumingCommandI18n = defineFamilyI18n(consumingCommand, {
  en: {
    name: "Consuming Command",
    typeText: "Shadow Brute Action",
    text: 'Until end of turn, Blasmophet, the Insatiable Hunger tokens you control get "Action - {t}: Attack. Go again"\nGo again\nBlood Debt',
  },
});

export const { blue: consumingCommandBlueI18n } = consumingCommandI18n.cards;
