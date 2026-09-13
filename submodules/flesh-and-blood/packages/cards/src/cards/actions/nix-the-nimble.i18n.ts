import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { nixTheNimble } from "./nix-the-nimble.ts";

export const nixTheNimbleI18n = defineFamilyI18n(nixTheNimble, {
  en: {
    name: "Nix the Nimble",
    text: "Contract - You are contracted to banish opponents' reaction cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: nixTheNimbleRedI18n,
  yellow: nixTheNimbleYellowI18n,
  blue: nixTheNimbleBlueI18n,
} = nixTheNimbleI18n.cards;
