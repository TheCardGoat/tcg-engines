import type { CharacterCard } from "@tcg/lorcana-types";
import { ryderFleetfootedInfiltratorI18n } from "./056-ryder-fleet-footed-infiltrator.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const ryderFleetfootedInfiltrator: CharacterCard = {
  id: "yNt",
  canonicalId: "ci_yNt",
  reprints: ["set8-056"],
  cardType: "character",
  name: "Ryder",
  version: "Fleet-Footed Infiltrator",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 56,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_83ba8c925b1d471d8f3833bdf059d6ad",
    tcgPlayer: 631338,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: ryderFleetfootedInfiltratorI18n,
};
