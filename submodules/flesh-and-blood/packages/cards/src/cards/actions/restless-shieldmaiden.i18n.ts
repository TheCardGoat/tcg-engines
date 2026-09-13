import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessShieldmaiden } from "./restless-shieldmaiden.ts";

export const restlessShieldmaidenI18n = defineFamilyI18n(restlessShieldmaiden, {
  en: {
    name: "Restless Shieldmaiden",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Shadow Resist 1\nDecay",
  },
});

export const { red: restlessShieldmaidenRedI18n } = restlessShieldmaidenI18n.cards;
