import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalPushingThroughI18n } from "./062-luisa-madrigal-pushing-through.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const luisaMadrigalPushingThrough: CharacterCard = {
  id: "3ym",
  canonicalId: "ci_3ym",
  reprints: ["set12-062"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Pushing Through",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 62,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e3a969791b0146e9af4d258746a3289f",
  },
  text: "Challenger +2",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [challenger(2)],
  i18n: luisaMadrigalPushingThroughI18n,
};
