import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalMusicallyTalented: CharacterCard = {
  id: "1ri",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Musically Talented",
  fullName: "Mirabel Madrigal - Musically Talented",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4e34e724a44eb13af101f51552399722b885dba",
  },
  abilities: [
    {
      id: "1ri-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1ri-2",
      type: "triggered",
      name: "HER OWN SPECIAL GIFT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "HER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Madrigal"],
};
