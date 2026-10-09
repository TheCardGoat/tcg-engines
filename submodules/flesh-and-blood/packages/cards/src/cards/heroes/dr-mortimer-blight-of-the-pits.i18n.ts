import { defineCardI18n } from "../../authoring/card-i18n.ts";
import { drMortimerBlightOfThePits } from "./dr-mortimer-blight-of-the-pits.ts";

export const drMortimerBlightOfThePitsI18n = defineCardI18n(drMortimerBlightOfThePits, {
  en: {
    name: "Dr. Mortimer, Blight of the Pits",
    typeText: "Assassin Hero",
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
