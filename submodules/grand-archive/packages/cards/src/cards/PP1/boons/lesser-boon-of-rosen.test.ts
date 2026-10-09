import { describe } from "vitest";
import { lesserBoonOfRosen } from "./lesser-boon-of-rosen.ts";
import { proveSubtypeElementBoon } from "../../../testing/subtype-element-boon.ts";
import { manicZealot } from "../../ALC/allies/manic-zealot.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { chargedMannequin } from "../../MRC/allies/charged-mannequin.ts";
import { productionCrawldroid } from "../../PRD/allies/production-crawldroid.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
/** @covers fJJBJ9M4c4-a1 */
describe("lesserBoonOfRosen subtype element permission", () => {
  proveSubtypeElementBoon(
    lesserBoonOfRosen,
    [
      [manicZealot, true],
      [shimmercloakAssassin, true],
      [chargedMannequin, true],
      [productionCrawldroid, false],
      [giantTortoise, false],
      [blitzMage, false],
      [windriderMage, false],
    ],
    false,
  );
});

import { expect, it } from "vitest";
import { subtypeBoonFixture } from "../../../testing/subtype-element-boon.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
/** @covers fJJBJ9M4c4-a2 */
describe("Rosen — once-only rested Powercell", () => {
  it("requires bestowal, pays three, and cannot be reused on a later turn", () => {
    const { game, p, boon, pay } = subtypeBoonFixture(lesserBoonOfRosen, manicZealot);
    const activate = (amount: number) =>
      p.activateAbility(boon, "fJJBJ9M4c4-a2", { reservePayment: pay(amount) });
    const before = game.state;
    expect(() => activate(3)).toThrow();
    expect(game.state).toEqual(before);
    p.execute({ move: "bestow-boon", cardId: boon.objectId });
    passEffectsStack(game);
    for (const amount of [2, 4]) {
      const before = game.state;
      expect(() => activate(amount)).toThrow();
      expect(game.state).toEqual(before);
    }
    activate(3);
    expect(p.zone("memory")).toHaveLength(3);
    expect(p.cards(powercell, { zone: "field" })).toHaveLength(0);
    const announced = game.state;
    expect(() => activate(3)).toThrow();
    expect(game.state).toEqual(announced);
    passEffectsStack(game);
    const cell = p.card(powercell, { zone: "field" });
    expect(game.state.objects[cell.objectId]!.isToken).toBe(true);
    expect(game.state.objects[cell.objectId]!.states.has("rested")).toBe(true);
    expect(game.player("player-two").cards(powercell, { zone: "field" })).toHaveLength(0);
    expect(game.player("player-three").cards(powercell, { zone: "field" })).toHaveLength(0);
    advanceToMain(game, p.id, game.state.turn.number);
    const later = game.state;
    expect(() => activate(3)).toThrow();
    expect(game.state).toEqual(later);
    expect(p.cards(powercell, { zone: "field" })).toHaveLength(1);
  });
});
