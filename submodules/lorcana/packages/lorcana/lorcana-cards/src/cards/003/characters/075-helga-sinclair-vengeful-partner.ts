import type { CharacterCard } from "@tcg/lorcana-types";
import { helgaSinclairVengefulPartnerI18n } from "./075-helga-sinclair-vengeful-partner.i18n";

export const helgaSinclairVengefulPartner: CharacterCard = {
  id: "1i7",
  canonicalId: "ci_1i7",
  reprints: ["set3-075"],
  cardType: "character",
  name: "Helga Sinclair",
  version: "Vengeful Partner",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 75,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_43db4d680b1c4ea7a375334266b28294",
    tcgPlayer: 537761,
  },
  text: [
    {
      title: "NOTHING PERSONAL",
      description:
        "When this character is challenged and banished, banish the challenging character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        target: {
          ref: "attacker",
        },
        type: "banish",
      },
      id: "1eg-1",
      name: "NOTHING PERSONAL",
      sourceZones: ["play", "discard"],
      text: "NOTHING PERSONAL When this character is challenged and banished, banish the challenging character.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: helgaSinclairVengefulPartnerI18n,
};
