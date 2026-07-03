import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinVigilantGuardP2ChallengeI18n } from "./p2-029-aladdin-vigilant-guard-challenge.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const aladdinVigilantGuardP2Challenge: CharacterCard = {
  id: "3H5",
  canonicalId: "ci_iLG",
  slug: "lorcana-ci_iLG",
  printings: [
    {
      id: "set8-p2-029-challenge",
      artId: "ci_iLG-challenge",
      setCode: "set8",
      collectorNumber: "29",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set8-170"],
  cardType: "character",
  name: "Aladdin",
  version: "Vigilant Guard",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 29,
  rarity: "special",
  specialRarity: "challenge",
  cost: 6,
  strength: 1,
  willpower: 9,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_809fee72df7a4e4e837973d452e858f6",
    tcgPlayer: "631466",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "SAFE PASSAGE",
      description:
        "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
  abilities: [
    bodyguard,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "fh8-2",
      name: "SAFE PASSAGE",
      text: "SAFE PASSAGE Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
      trigger: {
        event: "quest",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Ally",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: aladdinVigilantGuardP2ChallengeI18n,
};
