import { render } from "@testing-library/react";
import { GenericSimulatorPom } from "@tcg/simulator-testing";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import { describe, expect, test, vi } from "vite-plus/test";
import { useMemo, useState } from "react";

import { SimulatorHarness } from "@tcg/simulator-ui";
import type { HarnessFixture } from "@tcg/simulator-contract";
import { fixtures } from "./simulator/fixtures";

function HarnessUnderTest({
  onSubmitInteraction,
}: {
  onSubmitInteraction: Parameters<typeof SimulatorHarness>[0]["onSubmitInteraction"];
}) {
  const [activeFixtureId, setActiveFixtureId] = useState(fixtures[0]!.id);
  const activeFixture = useMemo<HarnessFixture>(
    () => fixtures.find((fixture) => fixture.id === activeFixtureId) ?? fixtures[0]!,
    [activeFixtureId],
  );

  return (
    <SimulatorHarness
      fixtures={fixtures}
      activeFixture={activeFixture}
      onSelectFixture={setActiveFixtureId}
      onSubmitInteraction={onSubmitInteraction}
    />
  );
}

describe("multi-game simulator POM", () => {
  test("selects an interaction candidate and submits the draft through jsdom", async () => {
    const onSubmitInteraction = vi.fn();
    const view = render(<HarnessUnderTest onSubmitInteraction={onSubmitInteraction} />);
    const pom = new GenericSimulatorPom(new TestingLibraryDomDriver(view.container));

    await pom.root().waitFor();
    expect(await pom.card("op-luffy-leader").count()).toBe(1);
    expect(await pom.interaction("op-declare-attack").count()).toBe(1);

    await pom.selectInteractionCandidate("op-declare-attack", "op-blocker");
    expect(
      await pom
        .interactionCandidate("op-declare-attack", "op-blocker")
        .getAttribute("aria-pressed"),
    ).toBe("true");

    await pom.submitInteraction("op-declare-attack");

    expect(onSubmitInteraction).toHaveBeenCalledWith("op-declare-attack", {
      entityIds: ["op-blocker"],
      optionIds: [],
      paymentIds: [],
      orderedIds: [],
    });
  });
});
