import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineResourcefulInfiltratorI18n } from "./162-jasmine-resourceful-infiltrator.i18n";

export const jasmineResourcefulInfiltrator: CharacterCard = {
  id: "wQI",
  canonicalId: "ci_wQI",
  reprints: ["set8-162"],
  cardType: "character",
  name: "Jasmine",
  version: "Resourceful Infiltrator",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 162,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d3a3d2e8ab64463b824138c932880523",
    tcgPlayer: 631459,
  },
  text: [
    {
      title: "JUST WHAT YOU NEED",
      description:
        "When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "wQI-1",
      name: "JUST WHAT YOU NEED",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: {
            selector: "chosen",
            cardTypes: ["character"],
            owner: "any",
            zones: ["play"],
            count: 1,
            excludeSelf: true,
          },
          duration: "until-start-of-next-turn",
        },
        type: "optional",
      },
      text: "JUST WHAT YOU NEED When you play this character, you may give another chosen character Resist +1 until the start of your next turn.",
    },
  ],
  i18n: jasmineResourcefulInfiltratorI18n,
};
