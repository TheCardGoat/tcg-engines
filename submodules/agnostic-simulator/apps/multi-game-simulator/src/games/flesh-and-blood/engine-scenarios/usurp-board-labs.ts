import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { viserai } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { acridStenchRed } from "@tcg/flesh-and-blood-cards/cards/actions/acrid-stench";
import { boneMassRed } from "@tcg/flesh-and-blood-cards/cards/actions/bone-mass";
import { bondedBurialRed } from "@tcg/flesh-and-blood-cards/cards/actions/bonded-burial";
import { malignantMigrationRed } from "@tcg/flesh-and-blood-cards/cards/actions/malignant-migration";
import { restlessClericRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { restlessCorporalRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { restlessPlowmanRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-plowman";
import { restlessShieldmaidenRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-shieldmaiden";
import { restlessSteedRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-steed";
import { hellboundAssaultBlue } from "@tcg/flesh-and-blood-cards/cards/actions/hellbound-assault";
import { corpseCoverRed } from "@tcg/flesh-and-blood-cards/cards/blocks/corpse-cover";
import { nimblismBlue } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { murmuringGloombladeRed } from "@tcg/flesh-and-blood-cards/cards/actions/murmuring-gloomblade";
import { shadowakeGloombladeRed } from "@tcg/flesh-and-blood-cards/cards/actions/shadowake-gloomblade";
import { bloodfrenzyGloombladeRed } from "@tcg/flesh-and-blood-cards/cards/actions/bloodfrenzy-gloomblade";
import { promiseOfPowerYellow } from "@tcg/flesh-and-blood-cards/cards/actions/promise-of-power";
import { enshrineSinRed } from "@tcg/flesh-and-blood-cards/cards/actions/enshrine-sin";
import { runechant } from "@tcg/flesh-and-blood-cards/cards/tokens/runechant";
import { runechantOfEnvyYellow } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-envy";
import { runechantOfWrathYellow } from "@tcg/flesh-and-blood-cards/cards/instants/runechant-of-wrath";
import { ritesOfNightfallBlue } from "@tcg/flesh-and-blood-cards/cards/actions/rites-of-nightfall";
import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

export const USURP_BOARD_LAB_SCENARIOS: FabScenarioCollection = {
  "usurp-corpse-cover-defense-board": {
    id: "usurp-corpse-cover-defense-board",
    label: "UST board — Corpse Cover defending Instant",
    description:
      "Corpse Cover is defending Snatch in the Reaction Step. Activate it from the combat chain, then destroy the arena Restless Corporal or discard the Restless Cleric in hand to prevent the next 2 damage.",
    group: "edge",
    tags: ["IAR", "board-lab", "corpse-cover", "combat-chain", "instant", "reaction"],
    viewerId: "player-2",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(dash),
          hand: [previewCard(snatchRed)],
          actionPoints: 1,
          deck: 6,
        },
        {
          hero: previewCard(malice),
          hand: [previewCard(corpseCoverRed), previewCard(restlessClericRed)],
          arena: [previewCard(restlessCorporalRed)],
          life: 20,
          deck: 6,
        },
        MANUAL,
      );
      const attacker = engine.as(dash);
      const defender = engine.as(malice);
      attacker.playAttack(snatchRed);
      defender.defendWith(corpseCoverRed);
      engine.toReaction("defender");
      return matchFromEngine(engine, "usurp-corpse-cover-defense-board");
    },
  },
  "usurp-zombie-choice-board": {
    id: "usurp-zombie-choice-board",
    label: "UST board — discard the right Restless zombie",
    description:
      "Acrid Stench is attacking and waiting on its discard-zombie picker. Restless Cleric and Restless Plowman in hand are legal; arena Restless Corporal / Steed / Shieldmaiden and the opposing Magister are not. A direct click on a hand zombie commits. Minimize the combat chain to inspect the idle arena copies. After this attack, Bone Mass, Bonded Burial, Malignant Migration, and Corpse Cover remain in hand for destroy-versus-discard follow-ups.",
    group: "edge",
    tags: ["IAR", "board-lab", "zombie", "discard", "targets", "prompts"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(malice),
          hand: [
            previewCard(acridStenchRed),
            previewCard(restlessClericRed),
            previewCard(restlessPlowmanRed),
            previewCard(boneMassRed),
            previewCard(bondedBurialRed),
            previewCard(malignantMigrationRed),
            previewCard(corpseCoverRed),
          ],
          arena: [
            previewCard(restlessCorporalRed),
            previewCard(restlessSteedRed),
            previewCard(restlessShieldmaidenRed),
          ],
          banished: [previewCard(hellboundAssaultBlue)],
          resourcePoints: 3,
          actionPoints: 2,
          deck: 6,
        },
        {
          hero: previewCard(dash),
          hand: [previewCard(nimblismBlue), previewCard(nimblismBlue)],
          arena: [previewCard(restlessMagisterRed)],
          life: 20,
          deck: 6,
        },
        MANUAL,
      );
      const player = engine.as(malice);
      player.playAttack(acridStenchRed, { stopAt: "on-attack" });
      player.accept();
      return matchFromEngine(engine, "usurp-zombie-choice-board");
    },
  },
  "usurp-gloomblade-usurp-board": {
    id: "usurp-gloomblade-usurp-board",
    label: "UST board — Usurp among similar Runechants",
    description:
      "Murmuring Gloomblade is being played and waiting on Usurp. Your Runechant, Runechant of Envy, and Runechant of Wrath are eligible, as is the opponent's public Runechant. Confirm stays disabled until a selection; a direct legal click still pays the cost. Pause the bot if you want to inspect the chain after Usurp — auto-pass will otherwise run combat. Shadowake Gloomblade and Bloodfrenzy Gloomblade remain banished, and Promise of Power / Enshrine Sin stay in hand.",
    group: "edge",
    tags: ["IAR", "board-lab", "usurp", "gloomblade", "runechant", "prompts"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const card = previewCard(murmuringGloombladeRed);
      const engine = FabTestEngine.start(
        {
          hero: previewCard(viserai),
          hand: [card, previewCard(promiseOfPowerYellow), previewCard(enshrineSinRed)],
          arena: [
            previewCard(runechant),
            previewCard(runechantOfEnvyYellow),
            previewCard(runechantOfWrathYellow),
          ],
          banished: [previewCard(shadowakeGloombladeRed), previewCard(bloodfrenzyGloombladeRed)],
          resourcePoints: 2,
          actionPoints: 2,
          deck: 6,
        },
        {
          hero: previewCard(dash),
          hand: [],
          arena: [previewCard(runechant)],
          life: 20,
          deck: 6,
        },
        MANUAL,
      );
      const player = engine.as(viserai);
      engine.playInstance(player.id, player.cardIn("hand", card).instanceId, {}, "explicit");
      return matchFromEngine(engine, "usurp-gloomblade-usurp-board");
    },
  },
  "usurp-gloomblade-pitch-board": {
    id: "usurp-gloomblade-pitch-board",
    label: "UST board — pitch for Shadowake Gloomblade",
    description:
      "Shadowake Gloomblade has paid its Usurp cost and is waiting for its resource payment. Rites of Nightfall is the legal blue pitch card. Clicking it must finish paying and put Shadowake onto the combat chain.",
    group: "edge",
    tags: ["IAR", "board-lab", "usurp", "gloomblade", "pitch", "prompts"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(viserai),
          hand: [previewCard(ritesOfNightfallBlue)],
          arena: [previewCard(runechant)],
          banished: [previewCard(shadowakeGloombladeRed)],
          resourcePoints: 0,
          actionPoints: 1,
          deck: 6,
        },
        { hero: previewCard(dash), hand: [], life: 20, deck: 6 },
        MANUAL,
      );
      const player = engine.as(viserai);
      const attack = player.cardIn("banished", shadowakeGloombladeRed);
      engine.exec({
        move: "begin-play",
        actorId: player.id,
        payload: { instanceId: attack.instanceId, from: "banished" },
      });
      const usurp = engine.getState().decision;
      if (!usurp || usurp.kind !== "entity-target") {
        throw new Error("Expected Shadowake Gloomblade to request an Usurp target.");
      }
      engine.answerDecision(player.id, {
        kind: "entity-target",
        instanceIds: [usurp.candidates[0]!.instanceId],
      });
      return matchFromEngine(engine, "usurp-gloomblade-pitch-board");
    },
  },
};
