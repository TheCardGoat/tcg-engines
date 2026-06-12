import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiShamanDuelistI18n } from "./055-rafiki-shaman-duelist.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const rafikiShamanDuelist: CharacterCard = {
  id: "q4q",
  canonicalId: "ci_q4q",
  reprints: ["set5-055"],
  cardType: "character",
  name: "Rafiki",
  version: "Shaman Duelist",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 55,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1f76ed2f61db4a9cb5a5647c43e1ebfc",
    tcgPlayer: 560105,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "SURPRISING SKILL",
      description:
        "When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    rush,
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 4,
      },
      id: "v9e-2",
      name: "SURPRISING SKILL",
      text: "SURPRISING SKILL When you play this character, he gains Challenger +4 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rafikiShamanDuelistI18n,
};
