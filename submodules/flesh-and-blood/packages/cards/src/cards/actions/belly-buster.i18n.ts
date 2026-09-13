import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bellyBuster } from "./belly-buster.ts";

export const bellyBusterI18n = defineFamilyI18n(bellyBuster, {
  en: {
    name: "Belly Buster",
    typeText: "Warrior Action",
    text: (amount) =>
      `Your next Warrior attack this turn gets +${amount}{p} and "When this attacks a hero, you may wager with them. The winner creates a Courage token."\nGo again`,
  },
});

export const { red: bellyBusterRedI18n, blue: bellyBusterBlueI18n } = bellyBusterI18n.cards;
