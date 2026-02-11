import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoFakeFlamingo: CharacterCard = {
  abilities: [
    {
      id: "1y2-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1y2-2",
      name: "IN DISGUISE",
      text: "IN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "fdddc0b41d647d7e1127afeec42899e1a0966861",
  },
  franchise: "Aladdin",
  fullName: "Iago - Fake Flamingo",
  id: "1y2",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Iago",
  set: "005",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nIN DISGUISE Whenever this character quests, you pay 2 {I} less for the next action you play this turn.",
  version: "Fake Flamingo",
  willpower: 4,
};
