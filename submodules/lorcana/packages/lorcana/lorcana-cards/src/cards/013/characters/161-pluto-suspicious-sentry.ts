import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoSuspiciousSentryI18n } from "./161-pluto-suspicious-sentry.i18n";

import { support } from "../../../helpers/abilities/support";

export const plutoSuspiciousSentry: CharacterCard = {
  id: "mVt",
  canonicalId: "ci_mVt",
  slug: "lorcana-ci_mVt",
  printings: [
    {
      id: "set13-161",
      artId: "set13-161",
      setCode: "set13",
      collectorNumber: "161",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-161"],
  cardType: "character",
  name: "Pluto",
  version: "Suspicious Sentry",
  inkType: ["sapphire"],
  set: "013",
  cardNumber: 161,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f867a6b5b4ef468b9a9f073194f98c9d",
  },
  text: [
    {
      title: "Support",
      description:
        "(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [support],
  i18n: plutoSuspiciousSentryI18n,
};
