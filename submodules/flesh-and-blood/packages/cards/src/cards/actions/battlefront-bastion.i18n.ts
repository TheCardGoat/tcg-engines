import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battlefrontBastion } from "./battlefront-bastion.ts";

export const battlefrontBastionI18n = defineFamilyI18n(battlefrontBastion, {
  en: {
    name: "Battlefront Bastion",
    typeText: "Generic Action - Attack",
    text: "When this defends alone, prevent the next 1 damage that would be dealt to you this turn.",
  },
});

export const {
  red: battlefrontBastionRedI18n,
  yellow: battlefrontBastionYellowI18n,
  blue: battlefrontBastionBlueI18n,
} = battlefrontBastionI18n.cards;
