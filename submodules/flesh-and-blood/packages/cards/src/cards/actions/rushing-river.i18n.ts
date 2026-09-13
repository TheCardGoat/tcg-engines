import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rushingRiver } from "./rushing-river.ts";

export const rushingRiverI18n = defineFamilyI18n(rushingRiver, {
  en: {
    name: "Rushing River",
    text: 'Combo - If Torrent of Tempo was the last attack this combat chain, Rushing River gains +1{p}, go again, and "If Rushing River hits, draw X cards then put X cards from your hand on top of your deck in any order, where X is the number of attacks that have hit this combat chain."',
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: rushingRiverRedI18n,
  yellow: rushingRiverYellowI18n,
  blue: rushingRiverBlueI18n,
} = rushingRiverI18n.cards;
