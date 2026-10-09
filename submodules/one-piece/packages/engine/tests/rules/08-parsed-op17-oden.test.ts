import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/index.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test.each(["OP17-001", "OP01-031", "OP13-001"])(
  "generated Oden checks both Leader alternatives under %s",
  (leaderCardId) => {
    const card = getCard("OP17-007"),
      original = card.effects;
    const effects = buildCardEffects(card.effect ?? "");
    if (!effects) throw new Error("Expected parsed Oden");
    card.effects = effects;
    try {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId,
          hand: ["OP17-007", "OP01-034", "OP02-018", "OP16-004", "OP13-013"],
          activeDon: 10,
        },
        {},
      );
      const inu = e.findCardInZone("south", "hand", "OP01-034");
      const marco = e.findCardInZone("south", "hand", "OP02-018");
      e.asSouth().play("OP17-007");
      if (leaderCardId === "OP13-001") {
        expect(e.getView("south").prompts).toHaveLength(0);
        expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(inu);
      } else {
        const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
        if (step.kind !== "selectEntity") throw new Error("Expected play selection");
        expect(step.candidates.map((c) => c.ref.id)).toEqual([inu, marco]);
        e.resolveDecision("effectPlaySelection", { selectedIds: [inu] }, "south");
        expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
          inu,
        );
      }
    } finally {
      card.effects = original;
    }
  },
);
