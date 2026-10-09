import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineScornfulSnobI18n } from "./126-lady-tremaine-scornful-snob.i18n";

export const ladyTremaineScornfulSnob: CharacterCard = {
  id: "DKz",
  canonicalId: "ci_DKz",
  slug: "lorcana-ci_DKz",
  printings: [
    {
      id: "set14-126",
      artId: "set14-126",
      setCode: "set14",
      collectorNumber: "126",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-126"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Scornful Snob",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "014",
  cardNumber: 126,
  rarity: "super_rare",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_69501b880fee49e28903ee6227f0ab08",
  },
  text: [
    {
      title: "DELICATE SENSIBILITIES",
      description:
        "Once during your turn, whenever you play a song, you may deal 1 damage to this character. If you do, draw a card.",
    },
    {
      title: "HARSH CRITIQUE",
      description: "Opposing characters with Singer enter play with 1 damage.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "DKz-1",
      name: "DELICATE SENSIBILITIES",
      type: "triggered",
      text: "DELICATE SENSIBILITIES Once during your turn, whenever you play a song, you may deal 1 damage to this character. If you do, draw a card.",
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
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              amount: 1,
              target: {
                selector: "self",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "conditional",
              condition: { type: "if-you-do" },
              then: { type: "draw", amount: 1, target: "CONTROLLER" },
            },
          ],
        },
      },
    },
    {
      id: "DKz-2",
      name: "HARSH CRITIQUE",
      type: "static",
      text: "HARSH CRITIQUE Opposing characters with Singer enter play with 1 damage.",
      effect: {
        type: "enters-with-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
        },
      },
    },
  ],
  i18n: ladyTremaineScornfulSnobI18n,
};
