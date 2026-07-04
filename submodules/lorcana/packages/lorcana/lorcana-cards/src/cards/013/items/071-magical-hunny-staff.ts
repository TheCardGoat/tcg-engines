import type { ItemCard } from "@tcg/lorcana-types";
import { magicalHunnyStaffI18n } from "./071-magical-hunny-staff.i18n";

export const magicalHunnyStaff: ItemCard = {
  id: "7J0",
  canonicalId: "ci_7J0",
  slug: "lorcana-ci_7J0",
  printings: [
    {
      id: "set13-071",
      artId: "set13-071",
      setCode: "set13",
      collectorNumber: "71",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-071"],
  cardType: "item",
  name: "Magical Hunny Staff",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 71,
  rarity: "rare",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f29818146dfa457bafbe71778a9367eb",
  },
  text: [
    {
      title: "GIFT OF THE HIVE",
      description:
        "Once during your turn, you may pay 1 {I} to give chosen character of yours the Hunny classification until the start of your next turn.",
    },
    {
      title: "SPELL OF SWIFTNESS",
      description:
        "{E}, 2 {I} — Chosen Hunny character of yours gains Evasive until the start of your next turn.",
    },
  ],
  abilities: [
    {
      id: "7J0-1",
      name: "GIFT OF THE HIVE",
      type: "activated",
      cost: {
        ink: 1,
      },
      restrictions: [
        {
          type: "once-per-turn",
        },
        {
          type: "during-turn",
          whose: "your",
        },
      ],
      effect: {
        type: "property-modification",
        property: "classification",
        operation: "add",
        value: "Hunny",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
      text: "GIFT OF THE HIVE Once during your turn, you may pay 1 {I} to give chosen character of yours the Hunny classification until the start of your next turn.",
    },
    {
      id: "7J0-2",
      name: "SPELL OF SWIFTNESS",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Hunny",
            },
          ],
        },
      },
      text: "SPELL OF SWIFTNESS {E}, 2 {I} - Chosen Hunny character of yours gains Evasive until the start of your next turn.",
    },
  ],
  i18n: magicalHunnyStaffI18n,
};
