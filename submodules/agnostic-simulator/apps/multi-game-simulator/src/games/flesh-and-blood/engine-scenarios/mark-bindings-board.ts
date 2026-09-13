import { restlessClericRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { restlessCommanderRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-commander";
import { restlessCorporalRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { restlessLooterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { restlessOutlawRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-outlaw";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { maliceDominaOfTheDead } from "@tcg/flesh-and-blood-cards/cards/heroes/malice-domina-of-the-dead";
import { markOfNeverestBlue } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-neverest";
import { markOfPathstoneBlue } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-pathstone";
import { markOfUsheringBlue } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-ushering";
import { voxNecropolis } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

export const MARK_BINDINGS_BOARD_SCENARIOS: FabScenarioCollection = {
  "mark-bindings-zombie-board": {
    id: "mark-bindings-zombie-board",
    label: "Marks — distinguish bound Zombie allies",
    description:
      "Six different Restless Zombie allies crowd the arena. Neverest is bound to Commander, Pathstone to Corporal, and Ushering to Looter; the history names all three pairings. Vox Necropolis lets the Zombies attack, while one additional copy of each Mark and 9 action points remain for interactive checks.",
    group: "edge",
    tags: ["IAR", "board-lab", "zombie", "aura", "bind", "marks", "history"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(maliceDominaOfTheDead),
          weapon1: [previewCard(voxNecropolis)],
          arena: [
            previewCard(restlessCommanderRed),
            previewCard(restlessCorporalRed),
            previewCard(restlessLooterRed),
            previewCard(restlessClericRed),
            previewCard(restlessMagisterRed),
            previewCard(restlessOutlawRed),
          ],
          hand: [
            previewCard(markOfNeverestBlue),
            previewCard(markOfPathstoneBlue),
            previewCard(markOfUsheringBlue),
            previewCard(markOfNeverestBlue),
            previewCard(markOfPathstoneBlue),
            previewCard(markOfUsheringBlue),
          ],
          resourcePoints: 9,
          actionPoints: 9,
          deck: 6,
        },
        { hero: previewCard(dash), hand: [], life: 20, deck: 6 },
        MANUAL,
      );
      const player = engine.as(maliceDominaOfTheDead);
      const bindings = [
        [markOfNeverestBlue, restlessCommanderRed],
        [markOfPathstoneBlue, restlessCorporalRed],
        [markOfUsheringBlue, restlessLooterRed],
      ] as const;

      for (const [mark, zombie] of bindings) {
        player.play(mark, {
          targetInstanceId: player.cardIn("arena", zombie).instanceId,
        });
        engine.untilIdle();
      }

      return matchFromEngine(engine, "mark-bindings-zombie-board");
    },
  },
};
