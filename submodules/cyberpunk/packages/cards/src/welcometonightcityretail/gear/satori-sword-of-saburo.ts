import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailSatoriSwordOfSaburo = defineCyberpunkCard({
  id: "4670d02b-b97a-4771-bb7e-65bdc012530e",
  slug: "satori-sword-of-saburo",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit wins a fight against a rival Unit, draw 1.",
  name: "Satori — Sword of Saburo",
  displayName: "Satori — Sword of Saburo",
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
        player: "friendly",
        result: "attackerWins",
        attacker: target.host(),
        defender: target.card({ controller: "rival", cardTypes: ["unit"] }),
      })
      .source(target.host())
      .effect(effect.draw({ player: "friendly", amount: 1 }))
      .build(),
  ],
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
}) satisfies GearCardDefinition;
