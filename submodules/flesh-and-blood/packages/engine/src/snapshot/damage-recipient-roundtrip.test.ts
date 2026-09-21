import { describe, expect, it } from "vitest";
import { oscilio } from "../../../cards/src/cards/heroes/oscilio.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { strikeTwiceRed } from "../../../cards/src/cards/actions/strike-twice.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  expectWait,
} from "../testing/index.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "./match-context.ts";

const padding = () => [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];

// Persistence-contract assertions belong here, separately from card proof.
// History is reached by public actions; no history counters are preseeded.
describe("recipient-aware damage history persistence", () => {
  for (const recipient of ["self", "opponent"] as const) {
    it(`roundtrips ${recipient} damage without losing or inventing opposing-hero credit`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [strikeTwiceRed, strikeTwiceRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: padding(),
        },
        { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);
      Oscilio.play(strikeTwiceRed, { target: recipient === "self" ? Oscilio : Dash });
      game.passBoth();
      const state = game.getState();
      const context = createFabMatchContext(state.cardDefinitions, state.publicCardIdentities);
      const persisted = serializeFabMatchSnapshot(state);
      const decoded: unknown = JSON.parse(JSON.stringify(persisted));
      const restored = restoreFabMatchSnapshot(decoded, context);
      const history = restored.players[Oscilio.id]!.history;
      for (const scope of [history.turn, history.chainLink]) {
        expect(scope.damageDealtByType).toEqual({ arcane: 3, physical: 0, generic: 0 });
        expect(scope.damageDealtToOpposingHeroesByType).toEqual({
          arcane: recipient === "opponent" ? 3 : 0,
          physical: 0,
          generic: 0,
        });
      }
      expect(restored.players[Dash.id]!.history.turn.damageDealtToOpposingHeroesByType).toEqual({
        arcane: 0,
        physical: 0,
        generic: 0,
      });

      const resumed = FabTestEngine.fromState(restored);
      const ResumedOscilio = resumed.as(oscilio);
      const ResumedDash = resumed.as(dash);
      const second = ResumedOscilio.cardIn("hand", strikeTwiceRed);
      if (recipient === "opponent") {
        ResumedOscilio.play(second, { target: ResumedDash });
        resumed.passBoth();
        expectFabPlayer(ResumedDash).toHaveLife(14);
        expectFabPlayer(ResumedOscilio).toHaveLife(20).toHaveAP(0).toHaveResourceCount(0);
        expectFabCard(ResumedOscilio, second).toBeIn("graveyard");
      } else {
        expectFabUnplayable(
          () => ResumedOscilio.play(second, { target: ResumedDash }),
          /action.point/i,
        );
        expectFabPlayer(ResumedOscilio).toHaveLife(17).toHaveAP(0).toHaveResourceCount(1);
        expectFabPlayer(ResumedDash).toHaveLife(20);
        expectFabCard(ResumedOscilio, second).toBeIn("hand");
      }
      expectWait(resumed).toBeIdle();
    });
  }
});
