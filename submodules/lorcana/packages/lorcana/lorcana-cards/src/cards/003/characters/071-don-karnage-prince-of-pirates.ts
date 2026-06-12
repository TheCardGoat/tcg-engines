import type { CharacterCard } from "@tcg/lorcana-types";
import { donKarnagePrinceOfPiratesI18n } from "./071-don-karnage-prince-of-pirates.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const donKarnagePrinceOfPirates: CharacterCard = {
  id: "0La",
  canonicalId: "ci_0La",
  reprints: ["set3-071"],
  cardType: "character",
  name: "Don Karnage",
  version: "Prince of Pirates",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 71,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_566472b873bc4f0caf367e8bc583e92e",
    tcgPlayer: 538355,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Villain", "Prince", "Pirate"],
  abilities: [evasive],
  i18n: donKarnagePrinceOfPiratesI18n,
};
