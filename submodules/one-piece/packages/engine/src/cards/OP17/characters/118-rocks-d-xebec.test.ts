import { describe, expect, test } from "vite-plus/test";
import { op07CaptainJohn082, op08Kaido079, op17RocksDXebec118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-118 Rocks.D.Xebec", () => {
  test("draws 1 and replays {Rocks Pirates} Characters within a total cost of 9", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17RocksDXebec118, op07CaptainJohn082, op08Kaido079],
        deck: ["OP16-096", "OP16-095"],
        activeDon: op17RocksDXebec118.cost,
      },
      {},
    );
    const johnId = engine.findCardInZone("south", "hand", op07CaptainJohn082);

    engine.playCard(op17RocksDXebec118, "south");
    // Draw 1 happened as part of the On Play.
    expect(engine.getView("south").players.south.hand.length).toBeGreaterThanOrEqual(2);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(johnId);
    expect(candidates).toContain(engine.findCardInZone("south", "hand", op08Kaido079));
    // Kaido alone (9) fits, but pairing him with any other Rocks card would
    // blow the total of 9 — so the replay takes only John (cost 2).
    engine.resolveDecision("effectPlaySelection", { selectedIds: [johnId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(johnId);
    expect(view.hand.map((card) => card.cardId)).toContain(op08Kaido079.id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("a pair within the total cost replays both Rocks cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17RocksDXebec118, op07CaptainJohn082, "OP08-051"],
        deck: ["OP16-096", "OP16-095"],
        activeDon: op17RocksDXebec118.cost,
      },
      {},
    );
    const johnId = engine.findCardInZone("south", "hand", op07CaptainJohn082);
    const buckinId = engine.findCardInZone("south", "hand", "OP08-051");

    engine.playCard(op17RocksDXebec118, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    // John (2) + Buckin (1) total 3 — well under the cap.
    engine.resolveDecision("effectPlaySelection", { selectedIds: [johnId, buckinId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(johnId);
    expect(view.characters.map((card) => card?.instanceId)).toContain(buckinId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
