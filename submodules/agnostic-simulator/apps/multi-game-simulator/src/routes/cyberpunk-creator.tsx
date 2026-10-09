import { useEffect, useState, type ComponentType } from "react";

export default function CyberpunkCreatorRoute() {
  const [Client, setClient] = useState<ComponentType | null>(null);
  useEffect(() => {
    let active = true;
    void import("./cyberpunk-creator-client").then((module) => {
      if (active) setClient(() => module.default);
    });
    return () => {
      active = false;
    };
  }, []);
  return Client ? <Client /> : <main role="status">Loading creator table…</main>;
}
