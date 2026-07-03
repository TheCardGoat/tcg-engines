import type { CharacterCard } from "@tcg/lorcana-types";
import { miriamMendelsohnTicketHolderI18n } from "./009-miriam-mendelsohn-ticket-holder.i18n";

export const miriamMendelsohnTicketHolder: CharacterCard = {
  id: "Zcu",
  canonicalId: "ci_Zcu",
  slug: "lorcana-ci_Zcu",
  printings: [
    {
      id: "set13-009",
      artId: "set13-009",
      setCode: "set13",
      collectorNumber: "9",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-009"],
  cardType: "character",
  name: "Miriam Mendelsohn",
  version: "Ticket Holder",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 9,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e0e489d501db4eebb61074a644dcb32c",
  },
  text: [
    {
      title: "I GOT 'EM!",
      description: "When you play this character, each player draws a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "I GOT 'EM!",
      text: "I GOT 'EM! When you play this character, each player draws a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
    },
  ],
  i18n: miriamMendelsohnTicketHolderI18n,
};
