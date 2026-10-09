import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanKhanIndustriesCeoI18n } from "./195-shere-khan-khan-industries-ceo.i18n";

export const shereKhanKhanIndustriesCeo: CharacterCard = {
  id: "lux",
  canonicalId: "ci_lux",
  slug: "lorcana-ci_lux",
  printings: [
    {
      id: "set14-195",
      artId: "set14-195",
      setCode: "set14",
      collectorNumber: "195",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-195"],
  cardType: "character",
  name: "Shere Khan",
  version: "Khan Industries CEO",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 195,
  rarity: "legendary",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_dae10098369548f3bf33437859828c25",
  },
  text: [
    {
      title: "NEW INCENTIVE",
      description:
        "When you play this character, chosen character can challenge ready characters this turn.",
    },
    {
      title: "CORNER THE MARKET",
      description:
        "Once during your turn, whenever one of your other characters banishes another character in a challenge, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "shere-khan-ceo-1",
      name: "NEW INCENTIVE",
      type: "triggered",
      text: "NEW INCENTIVE When you play this character, chosen character can challenge ready characters this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
    },
    {
      id: "shere-khan-ceo-2",
      name: "CORNER THE MARKET",
      type: "triggered",
      text: "CORNER THE MARKET Once during your turn, whenever one of your other characters banishes another character in a challenge, get 1 ink drop.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_OTHER_CHARACTERS",
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
  i18n: shereKhanKhanIndustriesCeoI18n,
};
