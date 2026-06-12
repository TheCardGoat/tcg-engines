import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  expectFailure,
  activeResources,
  expectCardInTrash,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st04StrikerPack012 } from "./012-striker-pack.ts";

const SWORD_STRIKE_OPTION = 0;
const LAUNCHER_STRIKE_OPTION = 1;

describe("Striker Pack (ST04-012)", () => {
  it("【Burst】deploys the Aile Strike Gundam token when no Earth Alliance token is in play.", () => {
    const engine = GundamTestEngine.create({ deck: [st04StrikerPack012] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st04StrikerPack012.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const before = p1.getCardsInZone("battleArea").length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getCardsInZone("battleArea").length).toBe(before + 1);
  });

  it("【Burst】-deployed Aile Strike Gundam cannot attack the turn it is deployed (rule 3-2-4)", () => {
    // Regression for the token-deploy bug: `handleDeployTokenAction` was
    // not pushing tokens onto `deployedThisTurn`, so the same-turn attack
    // gate (canAttack → !deployedThisTurn unless link unit) silently
    // passed. Aile Strike is not a Link Unit, so it must be blocked.
    const engine = GundamTestEngine.create({ deck: [st04StrikerPack012] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st04StrikerPack012.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    engine.fireShieldBurst(shieldId);
    const tokenId = p1.getCardsInZone("battleArea").at(-1);
    if (!tokenId) throw new Error("burst did not deploy a token");

    const G = engine.getG();
    expect(G.turnMetadata.deployedThisTurn).toContain(tokenId);
  });

  describe("【Main】Deploy 1 [Sword Strike Gundam] or 1 [Launcher Strike Gundam] Unit token.", () => {
    it("halts on a chooseOne prompt and deploys only the Sword Strike token when option 0 is picked", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;
      const before = p1.getCardsInZone("battleArea").length;

      expectSuccess(p1.playCommand(st04StrikerPack012));

      // The drain halts on the chooseOne — surfaced as a pending choice
      // prompt the controller must answer.
      const G = engine.getG();
      expect(G.pendingEffects.length).toBe(1);

      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: SWORD_STRIKE_OPTION } }));

      const after = p1.getCardsInZone("battleArea");
      expect(after.length).toBe(before + 1);
      const tokenId = after.at(-1)!;
      const meta = engine.getRuntime().state.ctx.zones.private.cardMeta[tokenId] as
        | { tokenSpec?: { name?: string } }
        | undefined;
      expect(meta?.tokenSpec?.name).toBe("Sword Strike Gundam");
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("deploys only the Launcher Strike token when option 1 is picked", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("battleArea").length;

      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: LAUNCHER_STRIKE_OPTION } }));

      const after = p1.getCardsInZone("battleArea");
      expect(after.length).toBe(before + 1);
      const tokenId = after.at(-1)!;
      const meta = engine.getRuntime().state.ctx.zones.private.cardMeta[tokenId] as
        | { tokenSpec?: { name?: string } }
        | undefined;
      expect(meta?.tokenSpec?.name).toBe("Launcher Strike Gundam");
    });

    it("rejects a bare resolveEffect against the chooseOne head with MISSING_CHOOSE_ONE_ANSWER", () => {
      // Per PR review: a no-arg `resolveEffect` would otherwise let the
      // executor silently default to option 0, bypassing the controller's
      // modal pick. Validate that the move surfaces the missing answer
      // explicitly instead.
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectFailure(p1.resolveEffect({}), "MISSING_CHOOSE_ONE_ANSWER");
    });

    it("Main-deployed token cannot attack the same turn (rule 3-2-4)", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: SWORD_STRIKE_OPTION } }));

      const tokenId = p1.getCardsInZone("battleArea").at(-1);
      if (!tokenId) throw new Error("Main effect did not deploy a token");
      const G = engine.getG();
      expect(G.turnMetadata.deployedThisTurn).toContain(tokenId);
    });
  });
});
