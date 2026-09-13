import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bondsOfAncestry } from "./bonds-of-ancestry.ts";

export const bondsOfAncestryI18n = defineFamilyI18n(bondsOfAncestry, {
  en: {
    name: "Bonds of Ancestry",
    typeText: "Ninja Action - Attack",
    text: 'Combo - If a card with Gustwave in its name was the last attack this combat chain, this costs {r}{r} less to play, and has go again and "When this attacks, you may banish a card with combo from your graveyard. If you do, search your deck for a card with the same name, banish it, then shuffle. You may play it this combat chain."',
  },
});

export const {
  red: bondsOfAncestryRedI18n,
  yellow: bondsOfAncestryYellowI18n,
  blue: bondsOfAncestryBlueI18n,
} = bondsOfAncestryI18n.cards;
