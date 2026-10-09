import { createContext } from "react";
import type { CreatorSetup } from "./setup";

export const CreatorMenuContext = createContext<{
  name: string;
  onEdit: (setup: CreatorSetup) => void;
} | null>(null);
