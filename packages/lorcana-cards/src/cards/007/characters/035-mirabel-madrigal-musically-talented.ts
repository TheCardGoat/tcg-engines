import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalMusicallyTalented: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1ri-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
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
      id: "1ri-2",
      name: "HER OWN SPECIAL GIFT",
      text: "HER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Madrigal"],
  cost: 6,
  externalIds: {
    ravensburger: "e4e34e724a44eb13af101f51552399722b885dba",
  },
  franchise: "Encanto",
  fullName: "Mirabel Madrigal - Musically Talented",
  id: "1ri",
  inkType: ["amber", "amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mirabel Madrigal",
  set: "007",
  strength: 2,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mirabel Madrigal.)\nHER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
  version: "Musically Talented",
  willpower: 6,
};
