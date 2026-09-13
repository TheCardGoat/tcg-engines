import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { releaseTheTension } from "./release-the-tension.ts";

export const releaseTheTensionI18n = defineFamilyI18n(releaseTheTension, {
  en: {
    name: "Release the Tension",
    text: ({
      textValue1,
    }) => `Your next arrow attack this turn gains +${textValue1}{p} and "Defense reactions can't be played from arsenal this chain link."
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: releaseTheTensionRedI18n,
  yellow: releaseTheTensionYellowI18n,
  blue: releaseTheTensionBlueI18n,
} = releaseTheTensionI18n.cards;
