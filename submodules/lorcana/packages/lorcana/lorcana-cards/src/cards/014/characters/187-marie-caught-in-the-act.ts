import type { CharacterCard } from "@tcg/lorcana-types";
import { marieCaughtInTheActI18n } from "./187-marie-caught-in-the-act.i18n";

export const marieCaughtInTheAct: CharacterCard = {
  id: "B3j",
  canonicalId: "ci_B3j",
  slug: "lorcana-ci_B3j",
  printings: [
    {
      id: "set14-187",
      artId: "set14-187",
      setCode: "set14",
      collectorNumber: "187",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-187"],
  cardType: "character",
  name: "Marie",
  version: "Caught in the Act",
  inkType: ["steel"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 187,
  rarity: "rare",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2b2dd9a7d04d4a4c9c9f9b256d560671",
  },
  text: [
    {
      title: "A LITTLE TREAT",
      description:
        "Whenever this character quests, if an opposing character took damage this turn, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "marie-1",
      name: "A LITTLE TREAT",
      type: "triggered",
      text: "A LITTLE TREAT Whenever this character quests, if an opposing character took damage this turn, get 1 ink drop.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "damaged-characters-by-owner",
        ownerScope: "opponent",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: marieCaughtInTheActI18n,
};
