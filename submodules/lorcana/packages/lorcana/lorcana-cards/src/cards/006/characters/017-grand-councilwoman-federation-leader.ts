import type { CharacterCard } from "@tcg/lorcana-types";
import { grandCouncilwomanFederationLeaderI18n } from "./017-grand-councilwoman-federation-leader.i18n";

export const grandCouncilwomanFederationLeader: CharacterCard = {
  id: "Lt8",
  canonicalId: "ci_Lt8",
  reprints: ["set6-017"],
  cardType: "character",
  name: "Grand Councilwoman",
  version: "Federation Leader",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 17,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07af0c79c9fe46728b147454f273deac",
    tcgPlayer: 587757,
  },
  text: [
    {
      title: "FIND IT!",
      description:
        "Whenever this character quests, your other Alien characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Alien"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "has-classification",
              classification: "Alien",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "zvy-1",
      name: "FIND IT!",
      text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: grandCouncilwomanFederationLeaderI18n,
};
