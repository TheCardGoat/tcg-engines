import { dragonFire, mauiHeroToAll, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { gastonBaritoneBully, mufasaBetrayedLeader } from "@tcg/lorcana-cards/cards/002";
import {
  chiefBogoCommandingOfficer,
  clawhauserFrontDeskOfficer,
} from "@tcg/lorcana-cards/cards/008";
import { createFixture } from "./fixture-factory";

export const triage20260505MufasaBogoRevealPlayFixture = createFixture({
  id: "triage-2026-05-05-mufasa-bogo-reveal-play",
  name: "Triage 2026-05-05 — Mufasa and Chief Bogo reveal play",
  description:
    "Player report: Mufasa - Betrayed Leader and Chief Bogo - Commanding Officer could not properly reveal and play a character for free. Repro path: challenge Maui with Mufasa, accept THE SUN WILL SET, and play Mickey Mouse - True Friend exerted from the revealed deck top. Then pass turn; Maui can challenge Clawhauser, accept SENDING BACKUP, and play Gaston - Baritone Bully ready from the next revealed deck top.",
  seed: "triage-2026-05-05-mufasa-bogo-reveal-play",
  skipPreGame: true,
  playerOne: {
    inkwell: dragonFire.cost,
    hand: [dragonFire],
    play: [
      { card: mufasaBetrayedLeader, isDrying: false },
      { card: chiefBogoCommandingOfficer, isDrying: false },
      { card: clawhauserFrontDeskOfficer, exerted: true, isDrying: false },
    ],
    deck: [gastonBaritoneBully, mickeyMouseTrueFriend],
  },
  playerTwo: {
    inkwell: 7,
    hand: [],
    play: [{ card: mauiHeroToAll, exerted: true, isDrying: false }],
    deck: 5,
  },
});
