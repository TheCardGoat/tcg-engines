import { hellboundAssaultBlue } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { ominousTollBlue } from "@tcg/flesh-and-blood-cards/cards/actions/ominous-toll";
import { restlessClericRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { restlessCommanderRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-commander";
import { restlessCorporalRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { restlessLooterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { restlessOutlawRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-outlaw";
import { restlessPlowmanRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-plowman";
import { restlessQuartermasterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-quartermaster";
import { restlessShieldmaidenRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-shieldmaiden";
import { restlessSteedRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-steed";
import { restlessTemplarRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-templar";
import { danseMacabre } from "@tcg/flesh-and-blood-cards/cards/equipment/danse-macabre";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { maliceDominaOfTheDead } from "@tcg/flesh-and-blood-cards/cards/heroes/malice-domina-of-the-dead";
import { markOfUsheringBlue } from "@tcg/flesh-and-blood-cards/cards/instants/mark-of-ushering";
import { voxNecropolis } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

export const MALICE_ZOMBIE_BOARD_SCENARIOS: FabScenarioCollection = {
  "malice-zombie-allies-board": {
    id: "malice-zombie-allies-board",
    label: "Malice — Vox Necropolis and Danse Macabre",
    description:
      "Malice, Domina of the Dead has Vox Necropolis and Danse Macabre equipped. Restless Commander is in the arena; every other Restless Zombie ally is in hand with blue-pitch payment cards and Mark of Ushering. Three Zombie allies in the graveyard exercise Malice, while three in banished exercise Vox Necropolis.",
    group: "edge",
    tags: ["IAR", "board-lab", "malice", "vox-necropolis", "danse-macabre", "zombie"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(maliceDominaOfTheDead),
          weapon1: [previewCard(voxNecropolis)],
          legs: [previewCard(danseMacabre)],
          arena: [previewCard(restlessCommanderRed)],
          graveyard: [
            previewCard(restlessClericRed),
            previewCard(restlessCorporalRed),
            previewCard(restlessMagisterRed),
          ],
          banished: [
            previewCard(restlessLooterRed),
            previewCard(restlessPlowmanRed),
            previewCard(restlessSteedRed),
          ],
          hand: [
            previewCard(restlessClericRed),
            previewCard(restlessCorporalRed),
            previewCard(restlessLooterRed),
            previewCard(restlessMagisterRed),
            previewCard(restlessOutlawRed),
            previewCard(restlessPlowmanRed),
            previewCard(restlessQuartermasterRed),
            previewCard(restlessShieldmaidenRed),
            previewCard(restlessSteedRed),
            previewCard(restlessTemplarRed),
            previewCard(hellboundAssaultBlue),
            previewCard(ominousTollBlue),
            previewCard(markOfUsheringBlue),
          ],
          actionPoints: 1,
          deck: 6,
        },
        {
          hero: previewCard(dash),
          hand: [],
          life: 20,
          deck: 6,
        },
        MANUAL,
      );

      return matchFromEngine(engine, "malice-zombie-allies-board");
    },
  },
};
