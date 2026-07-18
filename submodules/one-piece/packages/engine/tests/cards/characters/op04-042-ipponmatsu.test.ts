import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Ipponmatsu042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-042 Ipponmatsu", () => {
  test("boosts only a selected Slash Character, then trashes the top deck card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Ipponmatsu042],
      character: [eb01Doma005, eb01MountainGod018],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op04Ipponmatsu042.cost,
    });
    const slashId = engine.findCardInZone("south", "character", eb01Doma005);
    const nonSlashId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const trashedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op04Ipponmatsu042, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Ipponmatsu's Slash target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([slashId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonSlashId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [slashId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === slashId)?.power).toBe(
      6000,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === slashId)?.power).toBe(
      3000,
    );
  });

  test("may choose no Slash Character but still trashes the top deck card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Ipponmatsu042],
      character: [eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op04Ipponmatsu042.cost,
    });
    const slashId = engine.findCardInZone("south", "character", eb01Doma005);
    const trashedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op04Ipponmatsu042, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === slashId)?.power).toBe(
      3000,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.prompts).toHaveLength(0);
  });
});
