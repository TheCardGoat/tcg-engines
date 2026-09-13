import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overFlex } from "./over-flex.ts";

export const overFlexI18n = defineFamilyI18n(overFlex, {
  en: {
    name: "Over Flex",
    text: ({ textValue1 }) => `Your next arrow attack this turn gains +${textValue1}{p}.
Reload
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: overFlexRedI18n,
  yellow: overFlexYellowI18n,
  blue: overFlexBlueI18n,
} = overFlexI18n.cards;
