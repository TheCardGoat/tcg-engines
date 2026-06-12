import type { CharacterCard } from "@tcg/lorcana-types";
import { theMatchmakerUnforgivingExpertI18n } from "./123-the-matchmaker-unforgiving-expert.i18n";

export const theMatchmakerUnforgivingExpert: CharacterCard = {
  id: "w5E",
  canonicalId: "ci_w5E",
  reprints: ["set7-123"],
  cardType: "character",
  name: "The Matchmaker",
  version: "Unforgiving Expert",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 123,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b84afa5574c49e4a0270195f6ced69b",
    tcgPlayer: 618207,
  },
  text: [
    {
      title: "YOU ARE A DISGRACE!",
      description:
        "Whenever this character challenges another character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "fhg-1",
      name: "YOU ARE A DISGRACE!",
      text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theMatchmakerUnforgivingExpertI18n,
};
