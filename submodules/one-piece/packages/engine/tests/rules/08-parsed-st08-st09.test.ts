import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

function withParsedCharacter(id: string, run: () => void) {
  const card = getCard(id);
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    run();
  } finally {
    card.effects = original;
  }
}

test.each(["top", "bottom"] as const)(
  "parsed Ace saves itself in battle by trashing %s Life after snapshot",
  (position) => {
    withParsedCharacter("ST09-010", () => {
      let e = OnePieceTestEngine.create(
        { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        { character: [{ cardId: "ST09-010", rested: true }], life: ["ST03-002", "ST03-006"] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const ace = e.findCardInZone("north", "character", "ST09-010");
      const paid = e.findCardInZone("north", "life", position === "top" ? "ST03-002" : "ST03-006");
      e.declareAttack(e.findCardInZone("south", "character", "EB01-018"), ace, "south");
      e.resolveDecision("battleKoReplacement", { optionId: "yes" }, "north");
      const step = e.pendingDecision("effectLifePosition", "north").steps[0];
      if (step?.kind !== "chooseOption") throw new Error("Expected top or bottom Life choice.");
      expect(step.options.map((option) => option.id)).toEqual(["top", "bottom"]);
      expect(JSON.stringify(step)).not.toContain(paid);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectLifePosition", { optionId: position }, "north");
      expect(
        e.getView("north").players.north.characters.some((card) => card?.instanceId === ace),
      ).toBe(true);
      expect(e.getView("north").players.north.trash.some((card) => card.instanceId === paid)).toBe(
        true,
      );
      expect(e.getView("north").players.north.lifeCount).toBe(1);
      expect(e.getView("south").prompts).toHaveLength(0);
    });
  },
);

test.each(["OP01-120", "ST06-004"])(
  "parsed Bon Kurei's own KO depends on successful KO of battled %s",
  (targetCard) => {
    withParsedCharacter("ST08-013", () => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "ST08-013", attachedDon: 1, playedOnTurn: 0 }] },
        {
          character: [{ cardId: targetCard, rested: true }, "ST02-006"],
          hand: targetCard === "ST06-004" ? ["ST06-016"] : [],
          activeDon: 1,
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const source = e.findCardInZone("south", "character", "ST08-013");
      const target = e.findCardInZone("north", "character", targetCard);
      e.declareAttack(source, target, "south");
      if (targetCard === "ST06-004") {
        e.resolveDecision(
          "battleCounter",
          { selectedIds: [e.findCardInZone("north", "hand", "ST06-016")] },
          "north",
        );
        e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
      }
      e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const prevented = targetCard === "ST06-004";
      expect(
        e.getView("south").players.south.trash.some((card) => card.instanceId === source),
      ).toBe(!prevented);
      expect(
        e.getView("south").players.north.trash.some((card) => card.instanceId === target),
      ).toBe(!prevented);
      expect(
        e.getView("south").players.north.characters.some((card) => card?.cardId === "ST02-006"),
      ).toBe(true);
      expect(e.getView("south").prompts).toHaveLength(0);
    });
  },
);
