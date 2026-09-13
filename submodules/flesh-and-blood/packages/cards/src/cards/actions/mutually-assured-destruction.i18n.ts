import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mutuallyAssuredDestruction } from "./mutually-assured-destruction.ts";

export const mutuallyAssuredDestructionI18n = defineFamilyI18n(mutuallyAssuredDestruction, {
  en: {
    name: "Mutually Assured Destruction",
    typeText: "Assassin Action - Attack",
    text: "Contract - You are contracted to banish infected opponents' cards. Whenever you complete this contract, create a Silver token.\nThe first time each hero plays a reaction card this chain link, create a Bloodrot Pox token under each hero's control, then banish the top card of each hero's deck.",
  },
});

export const { red: mutuallyAssuredDestructionRedI18n } = mutuallyAssuredDestructionI18n.cards;
