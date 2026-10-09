import { unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailSatoriSwordOfSaburoI18n } from "./satori-sword-of-saburo.i18n.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailSatoriSwordOfSaburo = defineCyberpunkCard(
  {
    id: "4670d02b-b97a-4771-bb7e-65bdc012530e",
    slug: "satori-sword-of-saburo",
    canonicalId: "satori-sword-of-saburo",
    color: "red",
    classifications: ["Arasaka", "Weapon"],
    set: {
      code: "welcometonightcityretail",
      name: "Welcome to Night City — Retail",
    },
    printNumber: "026",
    artist: "Ivan Shavrin",
    imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/026.webp",
    rarity: "Uncommon",
    legality: "legal",
    hasSellTag: true,
    ram: 1,
    type: "gear",
    cost: 2,
    power: 2,
    abilities: [
      AbilityBuilder.triggered()
        .text("When this Unit wins a fight against a rival Unit, draw 1.")
        .onFightResolved({
          player: "any",
          winner: target.host(),
        })
        .source(target.host())
        .effect(effect.draw({ player: "friendly", amount: 1 }))
        .build(),
    ],
    attachment: {
      text: "Equip to a unit or face-up legend.",
      target: unitsAndLegendsInPlay("friendly", "faceUp"),
    },
  },
  welcomeToNightCityRetailSatoriSwordOfSaburoI18n,
) satisfies GearCardDefinition;
