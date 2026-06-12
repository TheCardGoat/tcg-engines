import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverAlienPirateI18n } from "./082-john-silver-alien-pirate.i18n";

export const johnSilverAlienPirate: CharacterCard = {
  id: "n4l",
  canonicalId: "ci_Jdb",
  reprints: ["set1-082", "set9-089"],
  cardType: "character",
  name: "John Silver",
  version: "Alien Pirate",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "001",
  cardNumber: 82,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e775c2ea351d4c3ca09630ade10092de",
    tcgPlayer: 647668,
  },
  text: [
    {
      title: "PICK YOUR FIGHTS",
      description:
        "When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      id: "n4l-1",
      name: "PICK YOUR FIGHTS",
      text: "PICK YOUR FIGHTS When you play this character, chosen opposing character gains Reckless during their next turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        duration: "their-next-turn",
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
      },
    },
    {
      id: "n4l-2",
      name: "PICK YOUR FIGHTS",
      text: "PICK YOUR FIGHTS Whenever this character quests, chosen opposing character gains Reckless during their next turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        duration: "their-next-turn",
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
      },
    },
  ],
  i18n: johnSilverAlienPirateI18n,
};
