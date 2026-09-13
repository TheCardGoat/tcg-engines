import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hurl } from "./hurl.ts";

export const hurlI18n = defineFamilyI18n(hurl, {
  en: {
    name: "Hurl",
    text: 'As an additional cost to play Hurl, you may pay {r}. When you do, it gains "When this attacks, target dagger you control deals 1 damage to target hero. If damage is dealt this way, the dagger has hit. Destroy the dagger."\nGo again',
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const { red: hurlRedI18n, yellow: hurlYellowI18n, blue: hurlBlueI18n } = hurlI18n.cards;
