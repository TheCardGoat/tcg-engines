import { describe, expect, it } from "vitest";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { lakereavingChill } from "./lakereaving-chill.ts";
import { breakApart } from "../actions/break-apart.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 7wX0tZmhYb-a1
 * @covers 7wX0tZmhYb-a2 */
describe("Lakereaving Chill — linked weapon", () => {
  it("rejects a champion host and removes the linked item's activated ability", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(lakereavingChill, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [potionOfHealing],
          hand: [lakereavingChill, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      potion = p.card(potionOfHealing);
    const canUsePotion = () =>
      p
        .legalCommands()
        .some(
          ({ command }) =>
            command.move === "activate-ability" && command.sourceId === potion.objectId,
        );
    expect(canUsePotion()).toBe(true);
    const reservePayment = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    const before = game.state;
    expect(() =>
      p.activate(lakereavingChill, {
        reservePayment,
        targets: { "intrinsic-link-target": [p.card(champion).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    p.activate(lakereavingChill, {
      reservePayment,
      targets: { "intrinsic-link-target": [potion.objectId] },
    });
    passEffectsStack(game);
    expect(canUsePotion()).toBe(false);
    const linked = game.state;
    expect(() => p.activateAbility(potion, "qtb31x97n2-a2")).toThrow();
    expect(game.state).toEqual(linked);
    expect(game.state.objects[p.card(lakereavingChill).objectId]!.hostId).toBe(potion.objectId);
  });
  it("keeps its link, disables its host's attack use, and is sacrificed when the host is destroyed", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(lakereavingChill, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [trainingSword],
          hand: [
            lakereavingChill,
            breakApart,
            ...Array.from({ length: 8 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one");
    const sword = p.card(trainingSword);
    const canAttackWithSword = () =>
      p
        .legalCommands()
        .some(
          ({ command }) =>
            command.move === "declare-attack" && command.weaponIds?.includes(sword.objectId),
        );
    expect(canAttackWithSword()).toBe(true);
    const pay = (amount: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, amount)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    p.activate(lakereavingChill, {
      reservePayment: pay(3),
      targets: { "intrinsic-link-target": [sword.objectId] },
    });
    passEffectsStack(game);
    const attachment = p.card(lakereavingChill, { zone: "field" });
    expect(game.state.objects[attachment.objectId]!.hostId).toBe(sword.objectId);
    expect(
      grandArchiveObjectActiveKeywords(
        game.program,
        game.state,
        game.state.objects[attachment.objectId]!,
      ),
    ).toContainEqual({ name: "link", target: "item-or-weapon" });
    expect(canAttackWithSword()).toBe(false);
    p.activate(breakApart, { reservePayment: pay(5), targets: { "target-1": [sword.objectId] } });
    passEffectsStack(game);
    expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[attachment.objectId]!.zone).toBe("graveyard");
  });
});
