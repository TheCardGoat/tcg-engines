import { describe } from "vitest";
import { deploymentBeacon } from "./deployment-beacon.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers klryvfq3hu-a1 */
describe("deploymentBeacon", () => {
  proveSummonOnEnter({
    card: deploymentBeacon,
    token: automatonDrone,
    cost: 1,
    count: 1,
    abilityId: "klryvfq3hu-a1",
    materialize: true,
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { crimsonRupture } from "../../RDO/actions/crimson-rupture.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers klryvfq3hu-a2 */
describe("Deployment Beacon — On Leave", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      it(`summons for the departing source controller, matching=${matching}, own=${own}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(deploymentBeacon, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [automatonDrone],
          playerOne: {
            champion,
            zones: {
              field: [deploymentBeacon],
              hand: [crimsonRupture, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [deploymentBeacon] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          controller = own ? p : q,
          other = own ? q : p,
          source = controller.card(deploymentBeacon);
        p.activate(crimsonRupture, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(controller.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(controller.cards(automatonDrone, { zone: "field" })).toHaveLength(matching ? 1 : 0);
        expect(other.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
        expect(other.cards(deploymentBeacon, { zone: "field" })).toHaveLength(1);
      });
});
