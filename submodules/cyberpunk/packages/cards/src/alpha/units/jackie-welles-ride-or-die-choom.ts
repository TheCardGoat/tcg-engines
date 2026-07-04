import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaJackieWellesRideOrDieChoom = defineCyberpunkCard({
  id: "2aa9e8cf-e425-4ebf-97dd-85a21f5b4424",
  slug: "jackie-welles-ride-or-die-choom",
  rulesText:
    "This unit has +2 power for each of your friendly gigs. (Units steal an extra gig for every 10 power.)",
  subname: "Ride Or Die Choom",
  name: "Jackie Welles",
  displayName: "Jackie Welles - Ride Or Die Choom",
  canonicalId: "jackie-welles-ride-or-die-choom",
  color: "yellow",
  classifications: ["Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α013",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a013.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 6,
  power: 6,
  abilities: [
    AbilityBuilder.static()
      .text("This unit has +2 power for each of your friendly gigs.")
      .effect(
        effect.modifyPower({
          target: target.self(),
          value: {
            type: "perCount",
            multiplier: 2,
            target: target.gig({ controller: "friendly", amount: "all" }),
          },
          duration: "continuous",
        }),
      )
      .build(),
  ],
  reminderText: ["Units steal an extra gig for every 10 power."],
}) satisfies UnitCardDefinition;
