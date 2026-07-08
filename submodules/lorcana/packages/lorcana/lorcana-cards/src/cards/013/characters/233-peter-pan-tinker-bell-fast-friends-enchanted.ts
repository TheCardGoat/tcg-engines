import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanTinkerBellFastFriendsEnchantedI18n } from "./233-peter-pan-tinker-bell-fast-friends-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const peterPanTinkerBellFastFriendsEnchanted: CharacterCard = {
  id: "FAK",
  canonicalId: "ci_3n0",
  slug: "lorcana-ci_3n0",
  printings: [
    {
      id: "set13-233-enchanted",
      artId: "ci_3n0-enchanted",
      setCode: "set13",
      collectorNumber: "233",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-060"],
  cardType: "character",
  name: "Peter Pan & Tinker Bell",
  version: "Fast Friends",
  inkType: ["amethyst", "ruby"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 233,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_706270bcb64b4f08b79b4d50a9306ad4",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "YOU CAN FLY!",
      description: "Your characters gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Fairy"],
  abilities: [
    shift("Peter Pan or Tinker Bell", 4),
    {
      type: "static",
      name: "YOU CAN FLY!",
      text: "YOU CAN FLY! Your characters gain Evasive.",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  i18n: peterPanTinkerBellFastFriendsEnchantedI18n,
};
