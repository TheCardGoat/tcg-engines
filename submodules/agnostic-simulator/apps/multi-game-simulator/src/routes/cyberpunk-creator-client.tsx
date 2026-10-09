import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { CreatorPage } from "../games/cyberpunk/pages/Creator.page";

export default function CyberpunkCreatorClient() {
  return (
    <CyberpunkSimulatorProviders>
      <CreatorPage />
    </CyberpunkSimulatorProviders>
  );
}
