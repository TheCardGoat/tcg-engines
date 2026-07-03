import type { ActionCard } from "@tcg/lorcana-types";
import { whatElseCanIDoEnchantedI18n } from "./237-what-else-can-i-do-enchanted.i18n";

export const whatElseCanIDoEnchanted: ActionCard = {
  id: "rdT",
  canonicalId: "ci_GBS",
  slug: "lorcana-ci_GBS",
  printings: [
    {
      id: "set12-237-enchanted",
      artId: "ci_GBS-enchanted",
      setCode: "set12",
      collectorNumber: "237",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-163"],
  cardType: "action",
  name: "What Else Can I Do?",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 237,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_a2a3a343dac1408092294ea226dcd028",
    tcgPlayer: "690556",
  },
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted. If a character sang this song, your characters gain Ward until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 2,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "hand",
                min: 1,
                max: 1,
              },
              {
                zone: "inkwell",
                min: 1,
                max: 1,
                exerted: true,
                facedown: true,
              },
            ],
          },
          {
            type: "conditional",
            condition: {
              type: "play-context",
              context: "characters-sang-this-song",
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              type: "gain-keyword",
              keyword: "Ward",
              duration: "until-start-of-next-turn",
              target: "YOUR_CHARACTERS",
            },
          },
        ],
      },
    },
  ],
  i18n: whatElseCanIDoEnchantedI18n,
};
