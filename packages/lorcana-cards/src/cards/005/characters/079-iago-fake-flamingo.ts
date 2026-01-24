import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoFakeFlamingo: CharacterCard = {
  id: "1y2",
  cardType: "character",
  name: "Iago",
  version: "Fake Flamingo",
  fullName: "Iago - Fake Flamingo",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 79,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fdddc0b41d647d7e1127afeec42899e1a0966861",
  },
  abilities: [
    {
      id: "1y2-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1y2-2",
      type: "triggered",
      name: "IN DISGUISE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "IN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
