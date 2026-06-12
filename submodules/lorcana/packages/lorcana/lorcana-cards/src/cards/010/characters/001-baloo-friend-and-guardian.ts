import type { CharacterCard } from "@tcg/lorcana-types";
import { balooFriendAndGuardianI18n } from "./001-baloo-friend-and-guardian.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { support } from "../../../helpers/abilities/support";

export const balooFriendAndGuardian: CharacterCard = {
  id: "T1d",
  canonicalId: "ci_T1d",
  reprints: ["set10-001"],
  cardType: "character",
  name: "Baloo",
  version: "Friend and Guardian",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 1,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9149ad820976479daad901fbd5bb1679",
    tcgPlayer: 659178,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard, support],
  i18n: balooFriendAndGuardianI18n,
};
