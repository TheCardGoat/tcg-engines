import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailDyingNightVSPistol = defineCyberpunkCard({
  id: "df06b6e2-1675-48a3-bfe2-d0bc4c5f35eb",
  slug: "dying-night-v-s-pistol",
  rulesText:
    '(Equip to a friendly Unit or face-up Legend.)\n{Attack} Decrease a Gig by up to 2. At the end of your turn, if this Unit is named "V", ready 2 Eddies.',
  name: "Dying Night — V's Pistol",
  displayName: "Dying Night — V's Pistol",
  canonicalId: "dying-night-v-s-pistol",
  color: "blue",
  classifications: ["Merc", "Weapon"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "128",
  artist: "Ivan Shavrin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/128.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["attack"],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Decrease a Gig by up to 2.")
      .onAttack()
      .source(target.host())
      .bind("selectedGig", target.gig({ amount: 1, selection: { mode: "choose", min: 1, max: 1 } }))
      .effect(
        effect.adjustGig({
          target: target.bound("selectedGig"),
          maxAmount: 2,
          direction: "decrease",
          chooseUpTo: true,
        }),
      )
      .build(),
    AbilityBuilder.triggered()
      .text('At the end of your turn, if this Unit is named "V", ready 2 Eddies.')
      .onTurnEnded({ player: "friendly" })
      .source(target.host())
      .effect(
        effect.readyEddies({
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "cardName",
              target: target.host(),
              name: "V",
            },
          ],
        }),
      )
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
