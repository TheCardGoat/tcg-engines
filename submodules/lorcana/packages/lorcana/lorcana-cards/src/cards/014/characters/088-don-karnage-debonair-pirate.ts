import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { donKarnageDebonairPirateI18n } from "./088-don-karnage-debonair-pirate.i18n";

export const donKarnageDebonairPirate: CharacterCard = {
  id: "957",
  canonicalId: "ci_957",
  slug: "lorcana-ci_957",
  printings: [
    {
      id: "set14-088",
      artId: "set14-088",
      setCode: "set14",
      collectorNumber: "88",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-088"],
  cardType: "character",
  name: "Don Karnage",
  version: "Debonair Pirate",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 88,
  rarity: "super_rare",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Lasting Impression",
      description:
        "When you play this character, deal 1 damage to each opposing character. This damage can't be reduced by Resist.",
    },
    {
      title: "So Suave",
      description: "While this character is exerted, each opposing damaged character gets -1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince", "Pirate"],
  abilities: [
    shift(4),
    {
      id: "957-1",
      name: "Lasting Impression",
      type: "triggered",
      text: "Lasting Impression When you play this character, deal 1 damage to each opposing character. This damage can't be reduced by Resist.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        ignoreResist: true,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
    {
      id: "957-2",
      name: "So Suave",
      type: "static",
      text: "So Suave While this character is exerted, each opposing damaged character gets -1 {L}.",
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [{ type: "status", status: "damaged" }],
        },
      },
    },
  ],
  i18n: donKarnageDebonairPirateI18n,
};
