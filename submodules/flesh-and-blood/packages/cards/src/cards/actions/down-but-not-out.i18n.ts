import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { downButNotOut } from "./down-but-not-out.ts";

export const downButNotOutI18n = defineFamilyI18n(downButNotOut, {
  en: {
    name: "Down But Not Out",
    typeText: "Generic Action - Attack",
    text: 'When this attacks a hero, if you have less {h} and control fewer equipment and tokens than them, this gets +3{p}, overpower, and "When this hits, create an Agility, Might, and Vigor token."',
  },
});

export const {
  red: downButNotOutRedI18n,
  yellow: downButNotOutYellowI18n,
  blue: downButNotOutBlueI18n,
} = downButNotOutI18n.cards;
