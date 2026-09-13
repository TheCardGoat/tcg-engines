import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ravenousRabble } from "./ravenous-rabble.ts";

export const ravenousRabbleI18n = defineFamilyI18n(ravenousRabble, {
  en: {
    name: "Ravenous Rabble",
    text: "When this attacks, reveal the top card of your deck. This gets -X{p}, where X is the pitch value of the card revealed this way.\nGo again",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: ravenousRabbleRedI18n,
  yellow: ravenousRabbleYellowI18n,
  blue: ravenousRabbleBlueI18n,
} = ravenousRabbleI18n.cards;
