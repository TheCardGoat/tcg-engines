import { describe, expect, it } from "vite-plus/test";
import {
  PITCH_TO_COLOR,
  nextAttackAction,
  plusPower,
  ruptureAbility,
} from "@tcg/flesh-and-blood-types";
import { registerFabCardDefinition, toFabCardDefinition } from "../cards.ts";
import { cripplingCrushRed } from "../../../cards/src/cards/actions/crippling-crush.ts";
import { nimblismRed } from "../../../cards/src/cards/actions/nimblism.ts";
import { chaseTheTailRed } from "../../../cards/src/cards/actions/chase-the-tail.ts";

describe("registration yields one canonical tree", () => {
  it("rejects an unknown has-status slug at load", () => {
    expect(() =>
      toFabCardDefinition({
        canonicalId: "unknown-status-card",
        types: ["Generic", "Action"],
        abilities: [
          {
            id: "x-a1",
            kind: "resolution",
            text: "If you've done a made-up thing this turn, draw a card.",
            condition: { type: "has-status", status: "not-a-real-status-slug" as never },
            effect: { type: "draw", count: 1, player: "controller" },
          },
        ],
      }),
    ).toThrow(/unknown has-status slug not-a-real-status-slug/);
  });

  it("drops dummy this-attack when appliesTo.next is present", () => {
    const registered = toFabCardDefinition({
      canonicalId: "next-attack-latch",
      types: ["Generic", "Action"],
      pitch: "1",
      abilities: [
        {
          id: "x-a1",
          kind: "resolution",
          text: "The next attack action card you play this turn gains +1{p}.",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: { selector: "this-attack" },
            duration: "this-turn",
            appliesTo: nextAttackAction({ grant: plusPower(1) }).appliesTo,
          },
        },
      ],
    });
    const effect = registered.base.abilities![0]!.effect;
    expect(effect).toMatchObject({
      appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
    });
    expect(effect && "target" in effect ? effect.target : undefined).toBeUndefined();
  });

  it("derives color from pitch when color is omitted", () => {
    const registered = toFabCardDefinition({
      canonicalId: "pitch-only",
      types: ["Generic", "Action"],
      pitch: "2",
    });
    expect(registered.base.numeric.pitch).toBe(2);
    expect(registered.base.color).toBe(PITCH_TO_COLOR["2"].toLowerCase());
    expect(registered.base.color).toBe("yellow");
  });

  it("expands Crush rider into the 4+ damage trigger and keeps the crush keyword", () => {
    const registered = registerFabCardDefinition(toFabCardDefinition(cripplingCrushRed as never));
    expect(
      registered.base.keywords?.some((keyword) =>
        typeof keyword === "string" ? keyword === "crush" : keyword.name === "crush",
      ),
    ).toBe(true);
    const crush = registered.base.abilities?.find((ability) => ability.label?.name === "crush");
    expect(crush).toMatchObject({
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          amount: { op: "gte", value: 4 },
          target: { kind: "hero" },
        },
      },
    });
  });

  it("Nimblism red keeps pitch/color pairing after registration", () => {
    const registered = toFabCardDefinition(nimblismRed as never);
    expect(registered.base.numeric.pitch).toBe(1);
    expect(registered.base.color).toBe("red");
  });

  it("expands Combo last-attack from the rider label at load", () => {
    const registered = toFabCardDefinition(chaseTheTailRed as never);
    const combo = registered.base.abilities?.find((ability) => ability.label?.name === "combo");
    expect(combo).toMatchObject({
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        state: { type: "last-attack-this-combat-chain", names: ["Crouching Tiger"] },
      },
    });
  });

  it("expands ruptureAbility unique rider into chain-link ≥4 at load", () => {
    const registered = toFabCardDefinition({
      canonicalId: "rupture-rider",
      types: ["Draconic", "Action", "Attack"],
      abilities: [
        {
          ...ruptureAbility({
            effect: plusPower(3, { target: { selector: "self" } }),
          }),
          id: "rupture-rider:rupture",
          text: "",
        },
      ],
    });
    expect(
      registered.base.keywords?.some((keyword) =>
        typeof keyword === "string" ? keyword === "rupture" : keyword.name === "rupture",
      ),
    ).toBe(true);
    const rupture = registered.base.abilities?.find((ability) => ability.label?.name === "rupture");
    expect(rupture).toMatchObject({
      kind: "resolution",
      condition: { type: "chain-link-count", comparison: { op: "gte", value: 4 } },
      effect: { type: "modify-numeric", property: "power", op: "add", amount: 3 },
    });
  });

  it("rejects event-deck as an authorable zone at load", () => {
    expect(() =>
      toFabCardDefinition({
        canonicalId: "event-deck-card",
        types: ["Generic", "Action"],
        abilities: [
          {
            id: "x-a1",
            kind: "resolution",
            text: "Look at the event deck.",
            effect: {
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["event-deck" as never],
                count: 1,
              },
            },
          },
        ],
      }),
    ).toThrow(/event-deck is not an authorable zone/);
  });
});
