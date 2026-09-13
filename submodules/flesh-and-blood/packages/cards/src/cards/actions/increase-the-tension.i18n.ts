import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { increaseTheTension } from "./increase-the-tension.ts";

export const increaseTheTensionI18n = defineFamilyI18n(increaseTheTension, {
  en: {
    name: "Increase the Tension",
    text: ({
      textValue1,
    }) => `Your next arrow attack this turn gains +${textValue1}{p} and "Defense reactions can't be played from hand this chain link."
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: increaseTheTensionRedI18n,
  yellow: increaseTheTensionYellowI18n,
  blue: increaseTheTensionBlueI18n,
} = increaseTheTensionI18n.cards;
