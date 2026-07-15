import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalMusicallyTalentedEnchantedI18n } from "./206-mirabel-madrigal-musically-talented-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const mirabelMadrigalMusicallyTalentedEnchanted: CharacterCard = {
  id: "Qxh",
  canonicalId: "ci_X10",
  slug: "lorcana-ci_X10",
  printings: [
    {
      id: "set7-206-enchanted",
      artId: "ci_X10-enchanted",
      setCode: "set7",
      collectorNumber: "206",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-035"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Musically Talented",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 206,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dbecb4ca526f46ac8faa1a361f1c8bdf",
    tcgPlayer: "619734",
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "HER OWN SPECIAL GIFT",
      description:
        "Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Madrigal"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "song",
          filter: {
            cardType: "song",
            maxCost: 3,
          },
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1ri-2",
      name: "HER OWN SPECIAL GIFT",
      text: "HER OWN SPECIAL GIFT Whenever this character quests, you may return a song card with cost 3 or less from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mirabelMadrigalMusicallyTalentedEnchantedI18n,
};
