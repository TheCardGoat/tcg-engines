import type { CharacterCard } from "@tcg/lorcana-types";
import { audreyRamirezGutsyMechanicI18n } from "./107-audrey-ramirez-gutsy-mechanic.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const audreyRamirezGutsyMechanic: CharacterCard = {
  id: "XG0",
  canonicalId: "ci_XG0",
  reprints: ["set12-107"],
  cardType: "character",
  name: "Audrey Ramirez",
  version: "Gutsy Mechanic",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 107,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_b2d382e40e5642e0bd54eb50f0b0dc5c",
  },
  text: "Rush",
  classifications: ["Storyborn", "Ally"],
  abilities: [rush],
  i18n: audreyRamirezGutsyMechanicI18n,
};
