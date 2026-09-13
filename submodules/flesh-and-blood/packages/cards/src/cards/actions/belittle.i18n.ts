import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { belittle } from "./belittle.ts";

export const belittleI18n = defineFamilyI18n(belittle, {
  en: {
    name: "Belittle",
    typeText: "Generic Action - Attack",
    text: "As an additional cost to play Belittle, you may reveal an attack action card with 3 or less base {p} from your hand. If you do, search your deck for a card named Minnowism, reveal it, put it into your hand, then shuffle your deck.\nGo again",
  },
});

export const {
  red: belittleRedI18n,
  yellow: belittleYellowI18n,
  blue: belittleBlueI18n,
} = belittleI18n.cards;
