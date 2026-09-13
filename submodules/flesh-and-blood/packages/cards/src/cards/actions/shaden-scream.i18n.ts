import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shadenScream } from "./shaden-scream.ts";

export const shadenScreamI18n = defineFamilyI18n(shadenScream, {
  en: {
    name: "Shaden Scream",
    text: ({ powerBonus }) => `As an additional cost to play this, banish a random card from hand.
Your next Brute or Shadow attack this turn gets +${powerBonus}{p}.
Go again`,
    typeText: "Shadow Brute Action",
  },
});

export const {
  red: shadenScreamRedI18n,
  yellow: shadenScreamYellowI18n,
  blue: shadenScreamBlueI18n,
} = shadenScreamI18n.cards;
