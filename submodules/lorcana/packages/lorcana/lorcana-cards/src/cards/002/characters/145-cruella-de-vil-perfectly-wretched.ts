import type { CharacterCard } from "@tcg/lorcana-types";
import { cruellaDeVilPerfectlyWretchedI18n } from "./145-cruella-de-vil-perfectly-wretched.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const cruellaDeVilPerfectlyWretched: CharacterCard = {
  id: "8wy",
  canonicalId: "ci_8wy",
  reprints: ["set2-145"],
  cardType: "character",
  name: "Cruella De Vil",
  version: "Perfectly Wretched",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "002",
  cardNumber: 145,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1676a1863764440991d68270eaf35bcd",
    tcgPlayer: 526869,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "OH, NO YOU DON'T",
      description:
        "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(3),
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1l6-2",
      name: "OH, NO YOU DON'T",
      text: "OH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: cruellaDeVilPerfectlyWretchedI18n,
};
