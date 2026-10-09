import { defineCardI18n } from "../../authoring/card-i18n.ts";
import { drMortimer } from "./dr-mortimer.ts";

export const drMortimerI18n = defineCardI18n(drMortimer, {
  en: {
    name: "Dr. Mortimer",
    typeText: "Assassin Hero - Young",
    text: "Instant - {t}: Cure a disease an opponent controls. If you do, create a Silver token.\nAttack Reaction - {t}, destroy 2 Silver you control: Target Assassin attack gets go again.",
    abilities: {
      instantTapCureDiseaseOpponentControlsCreateSilverToken: {
        displayName: "Cure a disease and create Silver",
      },
      attackReactionTapDestroy2SilverTargetAssassinAttackGetsGoAgain: {
        displayName: "Give an Assassin attack go again",
      },
    },
  },
});
