import { beforeEach, afterEach, describe, expect, test } from "vite-plus/test";
import { getCard, pMorgan026 } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { parseAlternateNames } from "../../../../tools/op-card-parser/src/alternate-names.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
const ids = ["P-024", "P-025", "P-027"];
const originals = ids.map((id) => getCard(id).effects);
const aliases = getCard("P-027").alternateNames;
beforeEach(() => {
  for (const id of ids) {
    const card = getCard(id);
    card.effects = buildCardEffects(
      [card.effect, "trigger" in card && card.trigger ? `[Trigger] ${card.trigger}` : ""]
        .filter(Boolean)
        .join(" "),
    );
  }
  getCard("P-027").alternateNames = parseAlternateNames(getCard("P-027").effect ?? "");
});
afterEach(() => {
  ids.forEach((id, index) => {
    getCard(id).effects = originals[index];
  });
  getCard("P-027").alternateNames = aliases;
});
describe("P024 King of Pirates", () => {
  test.each([0, 2])("Main counts own Characters%s and expires", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-024"], activeDon: 2, character: ["P-021", "P-023"].slice(0, count) },
      { character: ["ST02-002", "ST29-003"] },
    );
    e.asSouth().play("P-024");
    expect(e.getView("south").players.south.leader.power).toBe(5000 + 1000 * count);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("Main snapshots Character count before later play", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-024", "ST01-006"],
      activeDon: 3,
      character: ["P-021"],
    });
    e.asSouth().play("P-024");
    e.asSouth().play("ST01-006");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
  });
  test.each(["leader", "character"])("Trigger gives1000 to chosen%s then expires", (kind) => {
    const e = OnePieceTestEngine.create({}, { life: ["P-024", "ST02-002"], character: ["P-027"] });
    const target =
      kind === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "P-027");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets(target);
    expect(
      kind === "leader"
        ? e.getView("north").players.north.leader.power
        : e.getView("north").players.north.characters[0]?.power,
    ).toBe(kind === "leader" ? 6000 : 5000);
    e.asSouth().endTurn();
    expect(
      kind === "leader"
        ? e.getView("north").players.north.leader.power
        : e.getView("north").players.north.characters[0]?.power,
    ).toBe(kind === "leader" ? 5000 : 4000);
  });
  test("declines optional Trigger target with legal recipients", () => {
    const e = OnePieceTestEngine.create({}, { life: ["P-024", "ST02-002"], character: ["P-027"] });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets();
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
  });
});
describe("P025 Smoker", () => {
  test.each([
    ["ST04-003", 1, true],
    ["ST15-002", 1, false],
    ["ST25-003", 1, false],
    ["ST04-003", 0, false],
  ] as const)("Character%s DON%s protection=%s", (card, don, protectedByEffect) => {
    const e = OnePieceTestEngine.create(
      { character: [card] },
      { character: [{ cardId: "P-025", rested: true, attachedDon: don }] },
    );
    const id = e.findCardInZone("north", "character", "P-025");
    e.asSouth().attack(e.findCardInZone("south", "character", card), id);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      protectedByEffect,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === id)).toBe(
      !protectedByEffect,
    );
  });
  test("battle protection does not prevent effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "P-025", rested: true, attachedDon: 1 }] },
    );
    const id = e.findCardInZone("north", "character", "P-025");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("Leader without Special still KOs Smoker despite attached DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP13-001" },
      { character: [{ cardId: "P-025", rested: true, attachedDon: 1 }] },
    );
    const target = e.findCardInZone("north", "character", "P-025");
    e.asSouth().attack(e.leader("south"), target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").players.north.restedDon).toBe(1);
  });
});
describe("P027 General Franky", () => {
  test("opponent-turn aura uses base3000 even with another named power buff", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST30-001",
      character: ["P-027", "P-006", "P-022"],
    });
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 3000, 6000]);
    e.asSouth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 7000, 9000]);
    e.asNorth().endTurn();
    expect(
      e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c?.power),
    ).toEqual([4000, 3000, 6000]);
  });
  test("synthetic named-target consumer recognizes real Franky alternate name", () => {
    // No authored card currently selects literal Franky. This isolated consumer tests the name contract through commands.
    const saved = pMorgan026.effects;
    try {
      pMorgan026.effects = {
        effects: [
          {
            trigger: "onPlay",
            actions: [
              {
                action: "modifyPower",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: 1, upTo: true },
                  filters: [{ filter: "name", value: "Franky" }],
                },
                value: 1000,
                duration: "thisTurn",
              },
            ],
          },
        ],
      };
      const e = OnePieceTestEngine.create({
        hand: ["P-026"],
        activeDon: 4,
        character: ["P-027", "ST21-011", "ST02-002"],
      });
      const general = e.findCardInZone("south", "character", "P-027"),
        normal = e.findCardInZone("south", "character", "ST21-011");
      e.asSouth().play("P-026");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("name");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([general, normal]);
      e.asSouth().chooseTargets(general);
      expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    } finally {
      pMorgan026.effects = saved;
    }
  });
});
