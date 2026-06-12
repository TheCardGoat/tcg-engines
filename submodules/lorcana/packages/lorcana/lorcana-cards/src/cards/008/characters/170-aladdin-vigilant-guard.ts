import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinVigilantGuardI18n } from "./170-aladdin-vigilant-guard.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const aladdinVigilantGuard: CharacterCard = {
  id: "728",
  canonicalId: "ci_728",
  reprints: ["set8-170"],
  cardType: "character",
  name: "Aladdin",
  version: "Vigilant Guard",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 170,
  rarity: "rare",
  cost: 6,
  strength: 1,
  willpower: 9,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_809fee72df7a4e4e837973d452e858f6",
    tcgPlayer: 631466,
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
  i18n: aladdinVigilantGuardI18n,
};
