import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelTowerDefenderI18n } from "./080-rapunzel-tower-defender.i18n";

export const rapunzelTowerDefender: CharacterCard = {
  id: "uOc",
  canonicalId: "ci_uOc",
  slug: "lorcana-ci_uOc",
  printings: [
    {
      id: "set13-080",
      artId: "set13-080",
      setCode: "set13",
      collectorNumber: "80",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-080"],
  cardType: "character",
  name: "Rapunzel",
  version: "Tower Defender",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 80,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e41470068ad646b8855b398e4450d196",
  },
  text: [
    {
      title: "THE FATE'S DESIGN",
      description:
        "When you play this character, you may choose and discard a card. If you do, return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "uOc-1",
      name: "THE FATE'S DESIGN",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
            },
            {
              type: "return-to-hand",
              target: "CHOSEN_CHARACTER",
            },
          ],
        },
      },
      text: "THE FATE'S DESIGN When you play this character, you may choose and discard a card. If you do, return chosen character to their player's hand.",
    },
  ],
  i18n: rapunzelTowerDefenderI18n,
};
