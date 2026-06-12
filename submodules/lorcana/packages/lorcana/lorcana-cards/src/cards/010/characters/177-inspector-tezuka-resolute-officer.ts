import type { CharacterCard } from "@tcg/lorcana-types";
import { inspectorTezukaResoluteOfficerI18n } from "./177-inspector-tezuka-resolute-officer.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const inspectorTezukaResoluteOfficer: CharacterCard = {
  id: "CfV",
  canonicalId: "ci_CfV",
  reprints: ["set10-177"],
  cardType: "character",
  name: "Inspector Tezuka",
  version: "Resolute Officer",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 177,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0033f4eb44a14ebea87dbdca205d9247",
    tcgPlayer: 659404,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [bodyguard],
  i18n: inspectorTezukaResoluteOfficerI18n,
};
