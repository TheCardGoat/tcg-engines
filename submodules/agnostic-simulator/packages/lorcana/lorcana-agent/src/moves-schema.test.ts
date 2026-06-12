import { describe, expect, it } from "bun:test";
import { getLorcanaMoveIds, isLorcanaMoveId, validateLorcanaMovePayload } from "./moves-schema";

describe("lorcana-agent moves-schema", () => {
  it("includes all core in-match moves", () => {
    const ids = getLorcanaMoveIds();
    expect(ids).toContain("playCard");
    expect(ids).toContain("quest");
    expect(ids).toContain("challenge");
    expect(ids).toContain("sing");
    expect(ids).toContain("singTogether");
    expect(ids).toContain("activateAbility");
    expect(ids).toContain("putCardIntoInkwell");
    expect(ids).toContain("passTurn");
    expect(ids).toContain("moveCharacterToLocation");
  });

  it("excludes manual / debug moves", () => {
    const ids = getLorcanaMoveIds();
    expect(ids).not.toContain("manualMoveCard");
    expect(ids).not.toContain("manualSetLore");
    expect(ids).not.toContain("forfeitGame");
  });

  it("isLorcanaMoveId narrows correctly", () => {
    expect(isLorcanaMoveId("quest")).toBe(true);
    expect(isLorcanaMoveId("not-a-move")).toBe(false);
  });

  it("validates passTurn as an empty object", () => {
    const result = validateLorcanaMovePayload("passTurn", {});
    expect(result.ok).toBe(true);
  });

  it("rejects passTurn payloads with extra keys", () => {
    const result = validateLorcanaMovePayload("passTurn", { surprise: true });
    expect(result.ok).toBe(false);
  });

  it("validates a basic playCard payload (ink cost)", () => {
    const result = validateLorcanaMovePayload("playCard", {
      cardId: "c000001",
      cost: "ink",
    });
    expect(result.ok).toBe(true);
  });

  it("validates a shift playCard payload", () => {
    const result = validateLorcanaMovePayload("playCard", {
      cardId: "c000005",
      cost: "shift",
      shiftTargetId: "c000002",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects playCard with unknown cost discriminator", () => {
    const result = validateLorcanaMovePayload("playCard", {
      cardId: "c000001",
      cost: "borrow",
    });
    expect(result.ok).toBe(false);
  });

  it("validates quest with cardId", () => {
    const result = validateLorcanaMovePayload("quest", { cardId: "c000003" });
    expect(result.ok).toBe(true);
  });

  it("rejects quest without cardId", () => {
    const result = validateLorcanaMovePayload("quest", {});
    expect(result.ok).toBe(false);
  });

  it("validates challenge with attacker + defender", () => {
    const result = validateLorcanaMovePayload("challenge", {
      attackerId: "c000010",
      defenderId: "c000011",
    });
    expect(result.ok).toBe(true);
  });

  it("validates singTogether with multiple singer IDs", () => {
    const result = validateLorcanaMovePayload("singTogether", {
      singerIds: ["c000010", "c000011"],
      songId: "c000020",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects singTogether with empty singerIds", () => {
    const result = validateLorcanaMovePayload("singTogether", {
      singerIds: [],
      songId: "c000020",
    });
    expect(result.ok).toBe(false);
  });

  it("returns a descriptive error for unknown move ids", () => {
    const result = validateLorcanaMovePayload("teleport", {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("teleport");
    }
  });

  it("validates activateAbility with optional fields", () => {
    const result = validateLorcanaMovePayload("activateAbility", {
      cardId: "c000005",
      abilityIndex: 0,
      costs: { exertCharacters: ["c000006"] },
    });
    expect(result.ok).toBe(true);
  });

  it("validates resolveBag with optional params", () => {
    const result = validateLorcanaMovePayload("resolveBag", {
      bagId: "bag-1",
    });
    expect(result.ok).toBe(true);
  });
});
