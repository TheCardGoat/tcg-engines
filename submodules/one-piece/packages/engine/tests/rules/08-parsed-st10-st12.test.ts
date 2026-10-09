import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
function parsed(id: string, run: () => void) {
  const card = getCard(id);
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    run();
  } finally {
    card.effects = original;
  }
}

test.each([0, 7, 8])("parsed Luffy Leader checks total DON %s", (activeDon) =>
  parsed("ST10-002", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST10-002", activeDon });
    if (activeDon === 7) {
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      });
    } else {
      e.activateEffect(e.leader("south"), "activateMain", "south");
      e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    }
    expect(e.getView("south").players.south.activeDon).toBe(activeDon === 7 ? 7 : activeDon + 1);
  }),
);
test("parsed Sanji earns Rush from opposing current power", () =>
  parsed("ST10-004", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST10-004"], activeDon: 6 },
      { character: ["ST03-002"], life: ["ST03-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.playCard("ST10-004");
    e.declareAttack(e.findCardInZone("south", "character", "ST10-004"), e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(0);
  }));
test("parsed Luffy has no Blocker and ignores friendly Blocker activation", () =>
  parsed("ST10-006", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { character: ["ST10-006", "ST01-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffy = e.findCardInZone("north", "character", "ST10-006"),
      blocker = e.findCardInZone("north", "character", "ST01-006");
    e.declareAttack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"), "south");
    const step = e.pendingDecision("battleBlocker", "north").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Blocker selection");
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(luffy);
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === blocker)).toBe(true);
    expect(e.getView("north").prompts).toHaveLength(0);
  }));
test("parsed Jean Bart pays the outlined one-DON cost", () =>
  parsed("ST10-009", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST10-009"], activeDon: 5 });
    e.playCard("ST10-009");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(5);
    expect(e.getView("south").players.south.activeDon).toBe(1);
  }));
test.each([2, 3])("parsed Rika pays before opponent Life %s condition", (life) =>
  parsed("ST12-007", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST12-007"],
        character: [
          { cardId: "ST12-008", rested: true },
          { cardId: "ST12-004", rested: true },
        ],
        activeDon: 4,
      },
      { life },
    );
    e.playCard("ST12-007");
    e.asSouth().acceptOptional();
    if (life === 3) e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST12-008"));
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(life === 2);
    expect(e.getView("south").players.south.characters[1]?.rested).toBe(true);
  }),
);
test("parsed Mihawk can play a Slash Character without Muggy Kingdom", () =>
  parsed("ST12-003", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST12-003", "ST12-015", "ST12-009"],
      activeDon: 3,
    });
    e.playCard("ST12-003");
    const id = e.findCardInZone("south", "hand", "ST12-015");
    e.asSouth().choosePlay(id);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  }));
test.each([true, false])("parsed Uta mandatory public reveal with FILM add=%s", (add) =>
  parsed("ST11-001", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", activeDon: 1, deck: ["ST05-007", "ST03-002"] },
      { life: ["ST03-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST05-007"),
      other = e.findCardInZone("south", "deck", "ST03-002");
    e.attachDon(e.leader("south"), 1, "south");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    expect(
      e
        .getView("spectator")
        .logs.some((l) => l.message.includes("Gordon") && /reveal/i.test(l.message)),
    ).toBe(true);
    e.resolveDecision("effectSearchSelection", { selectedIds: add ? [top] : [] }, "south");
    expect(e.getView("south").players.south.hand.some((c) => c.instanceId === top)).toBe(add);
    expect(e.getState().players.south.deck).toEqual(add ? [other] : [other, top]);
  }),
);
test("parsed Zeff plays only revealed cost-two Character rested", () =>
  parsed("ST12-013", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST12-013", playedOnTurn: 0 }], deck: ["ST12-015", "ST03-002"] },
      { life: ["ST03-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST12-015");
    e.declareAttack(e.findCardInZone("south", "character", "ST12-013"), e.leader("north"), "south");
    e.asSouth().choosePlay(top);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === top)?.rested,
    ).toBe(true);
    expect(e.getView("spectator").logs.some((l) => /reveal/i.test(l.message))).toBe(true);
  }));
