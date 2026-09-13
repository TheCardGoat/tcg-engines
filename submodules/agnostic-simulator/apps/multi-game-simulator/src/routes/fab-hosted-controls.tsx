import { palantirAeronoughtRed } from "@tcg/flesh-and-blood-cards/cards/actions/palantir-aeronought";
import { maskOfMomentum } from "@tcg/flesh-and-blood-cards/cards/equipment/mask-of-momentum";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, Group, Text } from "@mantine/core";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { nimblismBlue } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { FleshAndBloodServerEngine } from "@tcg/flesh-and-blood-server-adapter";
import { buildInteractionSubmissionForActionId, type InteractionSubmission } from "@tcg/protocol";
import { FleshAndBloodSimulatorProviders } from "../games/flesh-and-blood/App";
import { FleshAndBloodTabletop } from "../games/flesh-and-blood/FleshAndBloodTabletop";
import { fabCardActionsFromInteractionView } from "../games/flesh-and-blood/LiveMatch.page";
import { presentRuntime } from "../games/flesh-and-blood/projection";
import { definitionsForFabMatchPresentation } from "../games/flesh-and-blood/cardArt";
import { useFabCardArt } from "../games/flesh-and-blood/FabPresentationCatalog";
import { useFabCardPresentation } from "../games/flesh-and-blood/useFabCardPresentation";

/** A local server adapter exercises the hosted controls without practice callbacks. */
function HostedControls() {
  const [params] = useSearchParams();
  const [game] = useState(() => {
    const requiredEquipment = params.get("attack") === "required-equipment";
    const attack = requiredEquipment ? palantirAeronoughtRed : snatchRed;
    const match = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [attack],
        resourcePoints: requiredEquipment ? 2 : 0,
        deck: [snatchRed, nimblismBlue, snatchRed, nimblismBlue],
      },
      {
        hero: bravo,
        head: requiredEquipment ? [maskOfMomentum] : [],
        hand:
          params.get("defenders") === "4"
            ? [snatchRed, nimblismBlue, snatchRed, nimblismBlue]
            : [snatchRed, nimblismBlue],
        deck: [snatchRed, nimblismBlue],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    if (params.get("phase") !== "opening") match.as(rhinar).playAttack(attack);
    return match;
  });
  const [engine] = useState(() => new FleshAndBloodServerEngine(game.getRuntime()));
  const [viewerId, setViewerId] = useState(() =>
    params.get("phase") === "opening" ? game.as(rhinar).id : game.as(bravo).id,
  );
  const [version, setVersion] = useState(engine.getStateID());
  const definitions = useMemo(
    () => definitionsForFabMatchPresentation(game.getRuntime().getState()),
    [game, version],
  );
  useFabCardPresentation(definitions, version);
  const resolver = useFabCardArt();
  const [error, setError] = useState<string | null>(null);
  const view = engine.getInteractionView(viewerId);
  const submit = (submission: InteractionSubmission) => {
    const result = engine.submitInteraction(viewerId, submission, {
      gameId: "hosted-controls-fixture",
      sourceAuthority: "server",
    });
    setError(result.success ? null : (result.error ?? "Action rejected"));
    setVersion(engine.getStateID());
  };
  return (
    <FleshAndBloodTabletop
      state={presentRuntime(game.getRuntime(), viewerId, resolver)}
      viewerId={viewerId}
      animationVersion={version}
      legalCommands={[]}
      interactionView={view}
      onSubmitInteraction={submit}
      cardActions={fabCardActionsFromInteractionView(view)}
      onCardAction={(actionId) => {
        const submission = buildInteractionSubmissionForActionId({ view, actionId });
        if (submission) submit(submission);
      }}
      sidebarExtra={
        <>
          <Text size="xs">Hosted controls fixture · local server adapter · version {version}</Text>
          <Group gap="xs">
            <Button size="xs" onClick={() => setViewerId(game.as(rhinar).id)}>
              Control attacker
            </Button>
            <Button size="xs" onClick={() => setViewerId(game.as(bravo).id)}>
              Control defender
            </Button>
          </Group>
          {error ? <Alert color="red">{error}</Alert> : null}
        </>
      }
    />
  );
}

export default function FabHostedControlsFixture() {
  if (!import.meta.env.DEV) return null;
  return (
    <FleshAndBloodSimulatorProviders>
      <HostedControls />
    </FleshAndBloodSimulatorProviders>
  );
}
