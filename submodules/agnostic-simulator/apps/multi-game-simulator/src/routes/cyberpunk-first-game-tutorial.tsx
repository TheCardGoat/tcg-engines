import { useEffect, useState } from "react";
import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { FirstGameTutorialPage } from "../games/cyberpunk/pages/FirstGameTutorial.page";

export default function CyberpunkFirstGameTutorialRoute() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <CyberpunkSimulatorProviders>
      <FirstGameTutorialPage />
    </CyberpunkSimulatorProviders>
  );
}
