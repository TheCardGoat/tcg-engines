import { Navigate } from "react-router";

import { FleshAndBloodSimulatorProviders } from "../games/flesh-and-blood/App";
import { FabFirstGameTutorialPage } from "../games/flesh-and-blood/first-game/FabFirstGameTutorial.page";
import { FAB_FIRST_GAME_TUTORIAL_ENABLED } from "../games/flesh-and-blood/first-game/storage";

export default function FabFirstGameTutorialRoute() {
  if (!FAB_FIRST_GAME_TUTORIAL_ENABLED) {
    return <Navigate to="/flesh-and-blood/simulator" replace />;
  }

  return (
    <FleshAndBloodSimulatorProviders>
      <FabFirstGameTutorialPage />
    </FleshAndBloodSimulatorProviders>
  );
}
