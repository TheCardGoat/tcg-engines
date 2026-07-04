import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanTinkerBellFastFriendsI18n } from "./060-peter-pan-tinker-bell-fast-friends.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const peterPanTinkerBellFastFriends: CharacterCard = {
  id: "3n0",
  canonicalId: "ci_3n0",
  slug: "lorcana-ci_3n0",
  printings: [
    {
      id: "set13-060",
      artId: "set13-060",
      setCode: "set13",
      collectorNumber: "60",
      rarity: "common",
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
  cardNumber: 60,
  rarity: "common",
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
      description:
        "(You may pay 4 {I} to play this on top of one of your characters named Peter Pan or Tinker Bell.)",
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
  i18n: peterPanTinkerBellFastFriendsI18n,
};
