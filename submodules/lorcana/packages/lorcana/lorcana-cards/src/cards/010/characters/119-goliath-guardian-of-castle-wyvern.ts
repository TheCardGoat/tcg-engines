import type { CharacterCard } from "@tcg/lorcana-types";
import { goliathGuardianOfCastleWyvernI18n } from "./119-goliath-guardian-of-castle-wyvern.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const goliathGuardianOfCastleWyvern: CharacterCard = {
  id: "5GE",
  canonicalId: "ci_5GE",
  reprints: ["set10-119"],
  cardType: "character",
  name: "Goliath",
  version: "Guardian of Castle Wyvern",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5cf26c9115a64c96a22f5151714cbc61",
    tcgPlayer: 658295,
  },
  text: [
    {
      title: "BE CAREFUL, ALL OF YOU",
      description:
        "Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Gargoyle"],
  abilities: [
    {
      id: "153-1",
      text: "BE CAREFUL, ALL OF YOU Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
      name: "BE CAREFUL, ALL OF YOU",
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      trigger: {
        event: "challenge",
        on: {
          classification: "Gargoyle",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    stoneByDay,
  ],
  i18n: goliathGuardianOfCastleWyvernI18n,
};
