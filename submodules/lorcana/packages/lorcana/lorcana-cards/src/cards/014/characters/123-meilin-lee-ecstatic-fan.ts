import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeEcstaticFanI18n } from "./123-meilin-lee-ecstatic-fan.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const meilinLeeEcstaticFan: CharacterCard = {
  id: "qWA",
  canonicalId: "ci_qWA",
  slug: "lorcana-ci_qWA",
  printings: [
    {
      id: "set14-123",
      artId: "set14-123",
      setCode: "set14",
      collectorNumber: "123",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-123"],
  cardType: "character",
  name: "Meilin Lee",
  version: "Ecstatic Fan",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "014",
  cardNumber: 123,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "Super Stoked",
      description:
        "Once during your turn, whenever you play a song, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Red Panda"],
  abilities: [
    singer(5),
    {
      id: "qWA-1",
      name: "Super Stoked",
      type: "triggered",
      text: "Super Stoked Once during your turn, whenever you play a song, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "gain-ink-drop",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: meilinLeeEcstaticFanI18n,
};
