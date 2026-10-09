import { describe } from "vitest";
import { obscuredOffering } from "./obscured-offering.ts";
import { proveAdditionalCardMoveCost } from "../../../testing/additional-card-move-cost.ts";
/** @covers S3ODMQ0V0o-a1 */
describe("obscuredOffering — additional card payment", () => {
  proveAdditionalCardMoveCost(obscuredOffering, 2, true);
});

import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { spiritBladeInfusion } from "../../DOA/actions/spirit-blade-infusion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers S3ODMQ0V0o-a2 */
describe("Obscured Offering — temporary Regalia Spellshroud", () => {
  for (const own of [false, true])
    it(`protects only the selected Regalia, own=${own}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(obscuredOffering, false, "activation-discount"),
      );
      const zones = {
        field: [trainingSword, trainingSword, giantTortoise],
        hand: [
          spiritBladeInfusion,
          spiritBladeInfusion,
          ...Array.from({ length: 5 }, () => woodlandSquirrels),
        ],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: own ? "playerOne" : "playerTwo",
        playerOne: {
          champion,
          zones: {
            ...zones,
            hand: [obscuredOffering, ...zones.hand],
            "material-deck": [trainingSword, trainingSword],
          },
        },
        playerTwo: { champion, zones },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        controller = own ? p : q;
      const [target, untouched] = controller.cards(trainingSword, { zone: "field" });
      const power = (id: keyof typeof game.state.objects) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: controller.id,
          bindings: {},
        });
      const pay = (player: typeof p, n: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const costSelections = [
        p.cards(trainingSword, { zone: "material-deck" }).map((c) => c.objectId),
      ];
      if (!own) q.pass();
      const before = game.state;
      expect(() =>
        p.activate(obscuredOffering, {
          reservePayment: pay(p, 2),
          costSelections,
          targets: { "target-1": [p.card(giantTortoise).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(obscuredOffering, {
        reservePayment: pay(p, 2),
        costSelections,
        targets: { "target-1": [target!.objectId] },
      });
      passEffectsStack(game);
      const protectedState = game.state;
      expect(() =>
        controller.activate(controller.cards(spiritBladeInfusion, { zone: "hand" })[0]!, {
          reservePayment: pay(controller, 2),
          targets: { "target-1": [target!.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(protectedState);
      controller.activate(controller.cards(spiritBladeInfusion, { zone: "hand" })[0]!, {
        reservePayment: pay(controller, 2),
        targets: { "target-1": [untouched!.objectId] },
      });
      passEffectsStack(game);
      expect(power(untouched!.objectId)).toBe(4);
      expect(power(target!.objectId)).toBe(1);
      advanceToMain(game, controller.id, game.state.turn.number);
      controller.activate(controller.card(spiritBladeInfusion, { zone: "hand" }), {
        reservePayment: pay(controller, 2),
        targets: { "target-1": [target!.objectId] },
      });
      passEffectsStack(game);
      expect(power(target!.objectId)).toBe(4);
    });
});
