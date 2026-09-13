import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tomeOfNecrosis } from "./tome-of-necrosis.ts";
export const tomeOfNecrosisI18n = defineFamilyI18n(tomeOfNecrosis, {
  en: {
    name: "Tome of Necrosis",
    typeText: "Necromancer Action",
    text: "As an additional cost to play this, destroy an ally you control or discard an ally.\nDraw a card and untap your hero.\nGo again",
  },
});
export const { red: tomeOfNecrosisRedI18n } = tomeOfNecrosisI18n.cards;
