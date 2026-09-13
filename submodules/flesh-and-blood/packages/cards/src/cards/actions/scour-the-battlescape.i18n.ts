import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scourTheBattlescape } from "./scour-the-battlescape.ts";

export const scourTheBattlescapeI18n = defineFamilyI18n(scourTheBattlescape, {
  en: {
    name: "Scour the Battlescape",
    text: "You may put a card from your hand on the bottom of your deck. If you do, draw a card.\nIf Scour the Battlescape is played from arsenal, it gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: scourTheBattlescapeRedI18n,
  yellow: scourTheBattlescapeYellowI18n,
  blue: scourTheBattlescapeBlueI18n,
} = scourTheBattlescapeI18n.cards;
