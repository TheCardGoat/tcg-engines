import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lookingForAScrap } from "./looking-for-a-scrap.ts";

export const lookingForAScrapI18n = defineFamilyI18n(lookingForAScrap, {
  en: {
    name: "Looking for a Scrap",
    text: "As an additional cost to play Looking for a Scrap, you may banish a card with 1{p} from your graveyard. When you do, this gains +1{p} and go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: lookingForAScrapRedI18n,
  yellow: lookingForAScrapYellowI18n,
  blue: lookingForAScrapBlueI18n,
} = lookingForAScrapI18n.cards;
