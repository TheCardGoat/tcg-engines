import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

// Synthetic native-action fixture; no printed opponent-top-deck card is claimed.
// Source.player selects the playing player; topOnly limits that player's deck.
test.each(["south", "north"] as const)(
  "opponent top-deck play uses the source deck when %s controls the effect",
  (controller) => {
    const playingSeat = controller === "south" ? "north" : "south";
    const source = getCard("ST01-001");
    const savedEffects = source.effects;
    const top = getCard("OP02-080");
    const deeper = getCard("OP02-084");
    const ownTop = getCard("OP01-103");
    try {
      for (const mode of ["accept", "decline", "forced", "ineligible"] as const) {
        source.effects = {
          effects: [
            {
              trigger: "activateMain",
              actions: [
                {
                  action: "play",
                  source: { player: "opponent", zone: "deck" },
                  topOnly: true,
                  count: { amount: 1, upTo: mode !== "forced" },
                  filters: [
                    { filter: "cost", comparison: "lte", value: mode === "ineligible" ? 1 : 4 },
                  ],
                },
              ],
            },
          ],
        };
        const effectPlayer = { leaderCardId: source, deck: [ownTop, deeper] };
        const playingPlayer = { leaderCardId: getCard("ST04-001"), deck: [top, deeper, ownTop] };
        let engine = OnePieceTestEngine.create(
          controller === "south" ? effectPlayer : playingPlayer,
          controller === "north" ? effectPlayer : playingPlayer,
          { activeSeat: controller },
        );
        const topId = engine.findCardInZone(playingSeat, "deck", top);
        const deeperId = engine.findCardInZone(playingSeat, "deck", deeper);
        const driver = controller === "south" ? engine.asSouth() : engine.asNorth();
        driver.activateMain(source);
        if (mode === "accept" || mode === "decline") {
          engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
          const choice = engine.pendingDecision("effectPlaySelection", playingSeat).steps[0];
          expect(choice).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
          if (choice?.kind !== "selectEntity") throw new Error("Expected top-card play choice.");
          expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([topId]);
          // The effect controller cannot inspect the opponent's private choice.
          expect(engine.getView(controller).prompts).toHaveLength(0);
          expect(JSON.stringify(engine.getView(controller).logs)).not.toContain(top.name);
          const chooser = playingSeat === "south" ? engine.asSouth() : engine.asNorth();
          if (mode === "accept") chooser.choosePlay(topId);
          else chooser.chooseNoPlay();
        }
        const view = engine.getView(playingSeat);
        const played = mode === "accept" || mode === "forced";
        expect(view.players[playingSeat].characters.filter(Boolean)).toHaveLength(played ? 1 : 0);
        if (played) expect(view.players[playingSeat].characters[0]?.instanceId).toBe(topId);
        expect(view.players[controller].characters.filter(Boolean)).toHaveLength(0);
        // Exact private deck identity proves neither a deeper card nor the other deck moved.
        expect(engine.findCardInZone(playingSeat, "deck", deeper)).toBe(deeperId);
        expect(engine.findCardInZone(controller, "deck", ownTop)).toBeTruthy();
        if (!played) expect(engine.findCardInZone(playingSeat, "deck", top)).toBe(topId);
        expect(view.prompts).toHaveLength(0);
      }
    } finally {
      source.effects = savedEffects;
    }
  },
);
