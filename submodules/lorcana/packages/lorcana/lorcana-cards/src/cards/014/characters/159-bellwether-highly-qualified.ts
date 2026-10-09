import type { CharacterCard } from "@tcg/lorcana-types";
import { bellwetherHighlyQualifiedI18n } from "./159-bellwether-highly-qualified.i18n";

export const bellwetherHighlyQualified: CharacterCard = {
  id: "TcQ",
  canonicalId: "ci_TcQ",
  slug: "lorcana-ci_TcQ",
  printings: [
    {
      id: "set14-159",
      artId: "set14-159",
      setCode: "set14",
      collectorNumber: "159",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-159"],
  cardType: "character",
  name: "Bellwether",
  version: "Highly Qualified",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 159,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Clever Plan",
      description:
        "When you play this character, you may put chosen opposing character with cost 2 or less into their player's inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "bellwether-1",
      name: "Clever Plan",
      type: "triggered",
      text: "Clever Plan When you play this character, you may put chosen opposing character with cost 2 or less into their player's inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-character",
          exerted: true,
          facedown: true,
          chosenBy: "you",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
        },
      },
    },
  ],
  i18n: bellwetherHighlyQualifiedI18n,
};
