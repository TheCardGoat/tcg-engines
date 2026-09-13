import { describe, expect, it, vi } from "vite-plus/test";

import {
  decodeGundamDragSource,
  dispatchGundamAttackDrop,
  dispatchGundamCardDrop,
  dispatchGundamPilotDrop,
  encodeGundamAttackTarget,
  encodeGundamAttackUnitSource,
  encodeGundamBattleAreaTarget,
  encodeGundamPilotTarget,
  gundamDragOverlaySize,
  type GundamAttackUnitDragSource,
  type GundamHandCardDragSource,
} from "./gundam-drag-drop-context.tsx";

const source: GundamAttackUnitDragSource = {
  type: "attack-unit",
  cardId: "attacker",
  card: { name: "Zeta Gundam (EX)", cardType: "unit" },
  legalTargetIds: ["enemy-unit", "direct"],
  directTargetLabel: "Attack player · The top Shield would receive damage if unblocked",
};

describe("Gundam attack drag/drop", () => {
  it("round-trips an attack source through the shared drag surface id", () => {
    expect(decodeGundamDragSource(encodeGundamAttackUnitSource(source))).toEqual(source);
  });

  it.each(["enemy-unit", "direct"])("commits a legal %s drop", (targetId) => {
    const handler = vi.fn();
    const overId = encodeGundamAttackTarget({ type: "attack-target", targetId });

    expect(dispatchGundamAttackDrop(source, overId, handler)).toBe(true);
    expect(handler).toHaveBeenCalledWith("attacker", targetId);
  });

  it("ignores invalid, missing, and deployment targets", () => {
    const handler = vi.fn();

    expect(
      dispatchGundamAttackDrop(
        source,
        encodeGundamAttackTarget({ type: "attack-target", targetId: "active-unit" }),
        handler,
      ),
    ).toBe(false);
    expect(dispatchGundamAttackDrop(source, null, handler)).toBe(false);
    expect(dispatchGundamAttackDrop(null, "anything", handler)).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it("commits a Pilot only when it lands on a legal Unit host", () => {
    const handler = vi.fn((_pilotId: string, unitId: string) => unitId === "open-unit");
    const pilot: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "pilot-from-hand",
      card: { name: "Pilot from hand", cardType: "pilot" },
    };

    expect(
      dispatchGundamPilotDrop(
        pilot,
        encodeGundamPilotTarget({ type: "pilot-target", unitId: "open-unit" }),
        handler,
      ),
    ).toBe(true);
    expect(handler).toHaveBeenCalledWith("pilot-from-hand", "open-unit");

    const commandAsPilot: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "command-as-pilot-from-hand",
      card: { name: "Command with Pilot", cardType: "command" },
    };
    expect(
      dispatchGundamPilotDrop(
        commandAsPilot,
        encodeGundamPilotTarget({ type: "pilot-target", unitId: "open-unit" }),
        handler,
      ),
    ).toBe(true);
    expect(handler).toHaveBeenCalledWith("command-as-pilot-from-hand", "open-unit");

    expect(
      dispatchGundamPilotDrop(
        pilot,
        encodeGundamPilotTarget({ type: "pilot-target", unitId: "paired-unit" }),
        handler,
      ),
    ).toBe(false);
    expect(
      dispatchGundamPilotDrop(
        { ...pilot, card: { name: "Unit", cardType: "unit" } },
        null,
        handler,
      ),
    ).toBe(false);
  });

  it("keeps a Pilot dropped on the battle area in the normal target-selection flow", () => {
    const handler = vi.fn();
    const pilot: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "pilot-from-hand",
      card: { name: "Pilot from hand", cardType: "pilot" },
    };

    expect(
      dispatchGundamCardDrop(
        pilot,
        encodeGundamBattleAreaTarget({ type: "battle-area", playerId: "player-one" }),
        handler,
      ),
    ).toBe(true);
    expect(handler).toHaveBeenCalledWith("pilot-from-hand");
  });

  it("keeps each drag overlay at the source card's rendered size", () => {
    const handSource: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "hand-card",
      card: { name: "Hand card" },
    };

    expect(gundamDragOverlaySize(handSource, "desktop")).toBe("tiny");
    expect(gundamDragOverlaySize(source, "desktop")).toBe("small");
    expect(gundamDragOverlaySize(source, "tablet")).toBe("small");
    expect(gundamDragOverlaySize(source, "mobile")).toBe("micro");
  });
});
