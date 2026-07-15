import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailJackieWellesRideOrDieChoom = defineCyberpunkCard({
  id: "b665e103-456b-4c51-9551-95b0bc87212a",
  slug: "jackie-welles-ride-or-die-choom",
  rulesText:
    "{Attack} Give this Unit +2 power this turn for each friendly Gig with an even value.\n{Defeated} Draw 1 for each friendly Gig with an odd value.",
  name: "Jackie Welles — Ride or Die Choom",
  displayName: "Jackie Welles — Ride or Die Choom",
  canonicalId: "jackie-welles-ride-or-die-choom",
  color: "yellow",
  classifications: ["Merc", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "048",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/048.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 6,
  power: 8,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Give this Unit +2 power this turn for each friendly Gig with an even value.")
      .onAttack()
      .source(target.self())
      .effect(
        effect.modifyPower({
          target: target.self(),
          value: {
            type: "perCount",
            multiplier: 2,
            target: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
              valueParity: "even",
            },
          },
          duration: "turn",
        }),
      )
      .build(),
    AbilityBuilder.triggered()
      .text("DEFEATED Draw 1 for each friendly Gig with an odd value.")
      .onDefeated()
      .source(target.self())
      .effect(
        effect.draw({
          player: "friendly",
          amount: {
            type: "perCount",
            multiplier: 1,
            target: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
              valueParity: "odd",
            },
          },
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
