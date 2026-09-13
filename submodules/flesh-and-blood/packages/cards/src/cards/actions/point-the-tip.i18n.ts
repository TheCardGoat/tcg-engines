import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pointTheTip } from "./point-the-tip.ts";

export const pointTheTipI18n = defineFamilyI18n(pointTheTip, {
  en: {
    name: "Point the Tip",
    text: ({
      textValue1,
    }) => `Target face up arrow in your arsenal gains +${textValue1}{p} until end of turn. Put an aim counter on it.
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: pointTheTipRedI18n,
  yellow: pointTheTipYellowI18n,
  blue: pointTheTipBlueI18n,
} = pointTheTipI18n.cards;
