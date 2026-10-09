import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleTakingOutTheTrashD23I18n } from "./d23-015-mr-incredible-taking-out-the-trash.i18n";

export const mrIncredibleTakingOutTheTrashD23: CharacterCard = {
  id: "Dnw",
  canonicalId: "ci_Y1z",
  slug: "lorcana-ci_Y1z",
  printings: [
    {
      id: "set12-d23-015",
      artId: "set12-d23-015",
      setCode: "set12",
      collectorNumber: "15",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set12-d23-015", "set12-185"],
  cardType: "character",
  name: "Mr. Incredible",
  version: "Taking Out the Trash",
  inkType: ["steel"],
  franchise: "D23",
  set: "012",
  cardNumber: 15,
  rarity: "special",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_78bb9b0a1716482995a63d5cd9a0d042",
    tcgPlayer: "690212",
  },
  text: [
    {
      title: "Ka-Pow!",
      description:
        "When you play this character, you may deal 2 damage to chosen opposing Robot or Villain character.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    {
      id: "A9f-1",
      name: "KA-POW!",
      type: "triggered",
      text: "KA-POW! When you play this character, you may deal 2 damage to chosen opposing Robot or Villain character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "or",
                filters: [
                  {
                    type: "has-classification",
                    classification: "Robot",
                  },
                  {
                    type: "has-classification",
                    classification: "Villain",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ],
  i18n: mrIncredibleTakingOutTheTrashD23I18n,
};
