import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookConnivingPirateI18n } from "./130-captain-hook-conniving-pirate.i18n";

export const captainHookConnivingPirate: CharacterCard = {
  id: "ner",
  canonicalId: "ci_ner",
  slug: "lorcana-ci_ner",
  printings: [
    {
      id: "set13-130",
      artId: "set13-130",
      setCode: "set13",
      collectorNumber: "130",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-130"],
  cardType: "character",
  name: "Captain Hook",
  version: "Conniving Pirate",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Have At You",
      description: "Whenever this character challenges another character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  abilities: [
    {
      type: "triggered",
      name: "HAVE AT YOU",
      text: "Whenever this character challenges another character, gain 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: captainHookConnivingPirateI18n,
};
