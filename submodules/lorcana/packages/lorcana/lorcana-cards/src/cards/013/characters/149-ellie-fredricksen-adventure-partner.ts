import type { CharacterCard } from "@tcg/lorcana-types";
import { ellieFredricksenAdventurePartnerI18n } from "./149-ellie-fredricksen-adventure-partner.i18n";

export const ellieFredricksenAdventurePartner: CharacterCard = {
  id: "i2l",
  canonicalId: "ci_i2l",
  slug: "lorcana-ci_i2l",
  printings: [
    {
      id: "set13-149",
      artId: "set13-149",
      setCode: "set13",
      collectorNumber: "149",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-149"],
  cardType: "character",
  name: "Ellie Fredricksen",
  version: "Adventure Partner",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 149,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Always with You",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "ALWAYS WITH YOU",
      text: "ALWAYS WITH YOU When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          facedown: true,
          exerted: true,
        },
      },
    },
  ],
  i18n: ellieFredricksenAdventurePartnerI18n,
};
