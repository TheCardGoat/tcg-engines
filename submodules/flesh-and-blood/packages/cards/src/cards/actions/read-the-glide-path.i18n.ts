import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { readTheGlidePath } from "./read-the-glide-path.ts";

export const readTheGlidePathI18n = defineFamilyI18n(readTheGlidePath, {
  en: {
    name: "Read the Glide Path",
    text: ({ textValue1, textValue2 }) => `Your next arrow attack this turn gains +${textValue1}{p}.
Opt ${textValue2}
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: readTheGlidePathRedI18n,
  yellow: readTheGlidePathYellowI18n,
  blue: readTheGlidePathBlueI18n,
} = readTheGlidePathI18n.cards;
