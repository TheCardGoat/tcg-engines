import type { CharacterCard } from "@tcg/lorcana-types";
import { sisuInHerElementI18n } from "./039-sisu-in-her-element.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const sisuInHerElement: CharacterCard = {
  id: "qi6",
  canonicalId: "ci_qi6",
  reprints: ["set6-039"],
  cardType: "character",
  name: "Sisu",
  version: "In Her Element",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  cardNumber: 39,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c695077508c44d728ac42c65ac8c97ab",
    tcgPlayer: 578173,
  },
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  abilities: [challenger(2)],
  i18n: sisuInHerElementI18n,
};
