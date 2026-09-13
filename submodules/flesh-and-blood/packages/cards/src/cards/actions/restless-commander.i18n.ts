import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessCommander } from "./restless-commander.ts";

export const restlessCommanderI18n = defineFamilyI18n(restlessCommander, {
  en: {
    name: "Restless Commander",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Zombies you control get +1{p}.\nDecay",
  },
});

export const { red: restlessCommanderRedI18n } = restlessCommanderI18n.cards;
