import type { CharacterCard } from "@tcg/lorcana-types";
import { davidXanatosCharismaticLeaderI18n } from "./116-david-xanatos-charismatic-leader.i18n";

export const davidXanatosCharismaticLeader: CharacterCard = {
  id: "9PD",
  canonicalId: "ci_9PD",
  reprints: ["set10-116"],
  cardType: "character",
  name: "David Xanatos",
  version: "Charismatic Leader",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 116,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c587751a496c4f5f9c199ca81459e231",
    tcgPlayer: 659622,
  },
  text: [
    {
      title: "LEARN FROM EVERYTHING",
      description: "During your turn, whenever one of your characters is banished, draw a card.",
    },
    {
      title: "WHAT ARE YOU WAITING FOR?",
      description:
        "Whenever this character quests, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "1jd-1",
      name: "LEARN FROM EVERYTHING",
      text: "LEARN FROM EVERYTHING During your turn, whenever one of your characters is banished, draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1jd-2",
      name: "WHAT ARE YOU WAITING FOR?",
      text: "WHAT ARE YOU WAITING FOR? Whenever this character quests, chosen character gains Rush this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: davidXanatosCharismaticLeaderI18n,
};
