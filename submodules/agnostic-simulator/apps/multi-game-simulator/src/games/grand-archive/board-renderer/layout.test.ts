import { describe, expect, it } from "vitest";
import {
  grandArchiveCardTextureUrl,
  grandArchiveFieldOverflow,
  grandArchiveLayout,
  grandArchiveScreenPosition,
} from "./layout";
import { grandArchiveComposition, grandArchiveSlotStyle, cambriaGeometry } from "./composition";
import type { GrandArchiveBoardCard } from "./types";
const card = (
  id: string,
  zone: GrandArchiveBoardCard["zone"],
  owner: GrandArchiveBoardCard["owner"] = "self",
): GrandArchiveBoardCard => ({ id, owner, zone, faceDown: false });

describe("portrait board projection", () => {
  it("shows five readable field cards in one row and exposes deliberate overflow", () => {
    const cards = Array.from({ length: 12 }, (_, i) => card(`field-${i}`, "field"));
    const poses = grandArchiveLayout(cards);
    expect(poses.size).toBe(5);
    expect(new Set([...poses.values()].map((pose) => pose.z)).size).toBe(1);
    for (const pose of poses.values()) {
      expect(pose.scale).toBe(1.62);
      expect(pose.z - pose.scale / (2 * (2.5 / 3.5))).toBeGreaterThan(0.5);
      const champion = grandArchiveLayout([{ ...card("champion", "field"), role: "champion" }]).get(
        "champion",
      )!;
      expect(pose.z + pose.scale / (2 * (2.5 / 3.5))).toBeLessThan(
        champion.z - champion.scale / (2 * (2.5 / 3.5)),
      );
    }
    expect(grandArchiveFieldOverflow(cards)).toEqual({ self: 7, opponent: 0 });
    expect(poses.has("field-5")).toBe(false);
  });

  it("keeps both owners effects in one ordered stack beside the central HUD", () => {
    const poses = grandArchiveLayout([
      card("first", "effects-stack"),
      card("response", "effects-stack", "opponent"),
    ]);
    expect(poses.get("first")!.x).toBe(poses.get("response")!.x);
    expect(poses.get("response")!.y).toBeGreaterThan(poses.get("first")!.y);
  });
  it("keeps ownership mirrored and the central decision area clear", () => {
    const poses = grandArchiveLayout([
      card("self", "field"),
      card("opponent", "field", "opponent"),
      { ...card("champion", "field"), role: "champion" },
    ]);
    expect(poses.get("self")).toMatchObject({ x: 0, z: 1.65 });
    expect(poses.get("opponent")!.z).toBe(-1.65);
    expect(poses.get("champion")!.z).toBe(4.45);
  });
  it("caps crowded field display explicitly while preserving a large hand", () => {
    const cards = [
      ...Array.from({ length: 30 }, (_, i) => card(`field-${i}`, "field")),
      ...Array.from({ length: 30 }, (_, i) => card(`hand-${i}`, "hand")),
    ];
    const poses = grandArchiveLayout(cards);
    expect(poses.size).toBe(35);
    expect(grandArchiveFieldOverflow(cards)).toEqual({ self: 25, opponent: 0 });
    expect(poses.has("field-5")).toBe(false);
    expect(poses.has("hand-29")).toBe(true);
    for (const pose of poses.values()) {
      expect(pose.scale).toBeGreaterThanOrEqual(0.7);
      const screen = grandArchiveScreenPosition(pose);
      expect(screen.left - screen.width / 2).toBeGreaterThan(0);
      expect(screen.left + screen.width / 2).toBeLessThan(100);
      if (!cards.find((card) => poses.get(card.id) === pose && card.zone === "hand"))
        expect(screen.top + screen.height / 2).toBeLessThan(100);
    }
  });
  it("keeps nested attachments with hosts regardless of input ordering", () => {
    const poses = grandArchiveLayout([
      { ...card("nested", "field"), attachedTo: "attachment" },
      { ...card("attachment", "field"), attachedTo: "host" },
      card("host", "field"),
    ]);
    expect(poses.get("attachment")!.x).toBeCloseTo(
      poses.get("host")!.x + 0.32 * poses.get("host")!.scale,
    );
    expect(poses.get("nested")!.x).toBeCloseTo(
      poses.get("host")!.x + 0.64 * poses.get("host")!.scale,
    );
    expect(poses.get("attachment")!.y).toBeLessThan(poses.get("host")!.y);
  });
  it("never fetches a concealed face, even when a caller accidentally supplies its URL", () => {
    expect(
      grandArchiveCardTextureUrl(
        { ...card("secret", "hand", "opponent"), faceDown: true, faceUrl: "secret-face" },
        "approved-back",
      ),
    ).toBe("approved-back");
    expect(
      grandArchiveCardTextureUrl(
        { ...card("visible", "field"), faceUrl: "authorized-face" },
        "approved-back",
      ),
    ).toBe("authorized-face");
  });
  it("fits the same portrait world across narrow and wide hosts", () => {
    const pose = grandArchiveLayout([card("card", "main-deck")]).get("card")!;
    for (const aspect of [390 / 844, 10 / 16, 1440 / 900]) {
      const screen = grandArchiveScreenPosition(pose, aspect);
      expect(screen.left + screen.width / 2).toBeLessThan(100);
      expect(screen.top + screen.height / 2).toBeLessThan(100);
    }
  });
  it("aligns overlay bounds to rotated card silhouettes in desktop and portrait viewports", () => {
    const pose = grandArchiveLayout([card("card", "field")]).get("card")!;
    for (const aspect of [1280 / 720, 390 / 844, 10 / 16]) {
      const normal = grandArchiveScreenPosition({ ...pose, turn: 0 }, aspect);
      const rested = grandArchiveScreenPosition({ ...pose, turn: Math.PI / 2 }, aspect);
      expect(rested.left).toBe(normal.left);
      expect(rested.top).toBe(normal.top);
      expect(rested.width * aspect).toBeCloseTo(normal.height);
      expect(rested.height).toBeCloseTo(normal.width * aspect);
      expect(rested.top + rested.height / 2).toBeLessThan(normal.top + normal.height / 2);
      const diagonal = grandArchiveScreenPosition({ ...pose, turn: -Math.PI / 4 }, aspect);
      expect(diagonal.width).toBeCloseTo((normal.width + normal.height / aspect) / Math.sqrt(2));
    }
  });
  it("keeps revealed deck entries above a separately capped concealed stack", () => {
    const poses = grandArchiveLayout([
      card("revealed", "main-deck"),
      ...Array.from({ length: 9 }, (_, i) => ({
        ...card(`back-${i}`, "main-deck"),
        faceDown: true,
      })),
    ]);
    expect(poses.size).toBe(4);
    expect(poses.get("revealed")!.y).toBeGreaterThan(poses.get("back-8")!.y);
    expect(poses.get("back-8")!.y).toBeGreaterThan(poses.get("back-7")!.y);
  });
  it("separates discard piles and mirrors intent inside the playfield", () => {
    const poses = grandArchiveLayout([
      card("trash", "graveyard"),
      card("banished", "banished"),
      card("intent", "intent"),
      card("rival-intent", "intent", "opponent"),
    ]);
    expect(Math.abs(poses.get("trash")!.x - poses.get("banished")!.x)).toBeGreaterThan(
      poses.get("trash")!.scale,
    );
    expect(poses.get("intent")!.x).toBe(-poses.get("rival-intent")!.x);
    expect(Math.abs(poses.get("intent")!.x)).toBeLessThan(4);
  });
  it("produces finite controls for zero-sized hosts and keeps the entire rail inside", () => {
    for (const [width, height] of [
      [0, 0],
      [0, 844],
      [1440, 900],
      [390, 844],
    ]) {
      const composition = grandArchiveComposition(width!, height!, "cambria-table-v1");
      expect(Number.isFinite(composition.width)).toBe(true);
      expect(Number.isFinite(composition.height)).toBe(true);
      for (const slot of Object.values(composition.slots)) {
        for (const value of Object.values(grandArchiveSlotStyle(slot, composition))) {
          expect(value).not.toMatch(/NaN|Infinity/);
        }
      }
      const geometry = cambriaGeometry(composition.width, composition.height, composition.mode);
      expect(geometry.railLeft + geometry.railWidth).toBeLessThan(composition.width / 2);
    }
  });
});
