import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailTowerfall,
} from "@tcg/cyberpunk-cards";
import {
  buildDecisionContext,
  tacticalStrategy,
  withDeckProfile,
  type DeckStrategyProfile,
} from "../../src/automation/index.ts";
import { CyberpunkTestEngine } from "../../src/testing/index.ts";
import { semanticViewHash } from "../../src/automation/public-view-hash.ts";

const filler = [
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorpoSecurity,
];

const bbgProfile: DeckStrategyProfile = {
  deckId: "authored-bbg-towerfall-control",
  plan: "Do not restart an activation that was declined.",
  coreCards: ["Alt Cunningham", "Towerfall"],
  preferredFreeCards: ["Chrome Reverie"],
  commitSources: ["Placide", "Trust No One", "Chrome Reverie"],
  pacing: "develop-first",
};

/**
 * Alt's activated replay spends nothing until a trash program is chosen.
 * Declining restores the public board. The chooser used to activate and
 * decline forever. It must leave that loop.
 */
describe("declined activation does not repeat the public board", () => {
  test("passes the turn instead of activating Alt and declining the unaffordable replay", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
        ],
        trash: [welcomeToNightCityRetailTowerfall],
        eddies: 2,
        deck: filler,
      },
      { eddies: 0, deck: filler },
    );
    const played = playUntilAdvance(engine);
    expect(played.moves.filter((move) => move === "activateAbility").length).toBeLessThan(2);
    expect(played.repeats).toBeLessThan(2);
    expect(played.moves).toContain("passPhase");
  });

  test("does not activate Alt and decline when an affordable replay would be bottom-decked", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
        ],
        trash: [welcomeToNightCityRetailFloorIt],
        eddies: 4,
        deck: filler,
      },
      {
        eddies: 0,
        deck: filler,
        field: [{ card: welcomeToNightCityRetailRidingNomad, hasLag: false }],
      },
    );
    const played = playUntilAdvance(engine);
    expect(played.moves.filter((move) => move === "activateAbility").length).toBeLessThan(2);
    expect(played.repeats).toBeLessThan(2);
    expect(played.advanced).toBe(true);
  });
});

function playUntilAdvance(engine: CyberpunkTestEngine): {
  moves: string[];
  repeats: number;
  advanced: boolean;
} {
  const strategy = withDeckProfile(tacticalStrategy, bbgProfile);
  const start = semanticViewHash(engine.getFilteredView(engine.getActivePlayerId()));
  const moves: string[] = [];
  let repeats = 0;
  let advanced = false;

  for (let step = 0; step < 8; step += 1) {
    const active = engine.getActivePlayerId();
    const ctx = buildDecisionContext(engine.getLocalEngine(), active, () => 0);
    const decision = strategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") break;
    moves.push(decision.move);
    const result = engine.getLocalEngine().processCommand(
      {
        commandID: `stall-${step}`,
        move: decision.move,
        input: decision.args ? { args: decision.args } : undefined,
      },
      active,
    );
    expect(result.success, result.success ? "" : result.error).toBe(true);
    const hash = semanticViewHash(engine.getFilteredView(active));
    if (hash === start) repeats += 1;
    else advanced = true;
    if (decision.move === "passPhase" || advanced) break;
  }

  return { moves, repeats, advanced };
}
