import type { CharacterCard } from "@tcg/lorcana-types";
import { baymaxGiantRobotI18n } from "./104-baymax-giant-robot.i18n";

export const baymaxGiantRobot: CharacterCard = {
  id: "PVC",
  canonicalId: "ci_PVC",
  reprints: ["set7-104"],
  cardType: "character",
  name: "Baymax",
  version: "Giant Robot",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 104,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_98c983fba498470ba2ff0518902e8cc5",
    tcgPlayer: 619462,
  },
  text: [
    {
      title: "Universal Shift 4",
      description: "(You may pay 4 {I} to play this on top of any one of your characters.)",
    },
    {
      title: "FUNCTIONALITY IMPROVED",
      description:
        "When you play this character, if you used Shift to play him, remove all damage from him.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Robot"],
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1c2-1",
      keyword: "Shift",
      text: "Universal Shift 4",
      type: "keyword",
    },
    {
      effect: {
        type: "remove-damage",
        amount: "all",
        target: "SELF",
      },
      condition: {
        type: "used-shift",
      },
      id: "1c2-2",
      name: "FUNCTIONALITY IMPROVED",
      text: "FUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: baymaxGiantRobotI18n,
};
