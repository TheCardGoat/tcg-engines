import { createPromptVisibilityStore } from "@tcg/simulator-ui";
import type { Side } from "../../engine";

// Preserve Cyberpunk's seat-scoped API while sharing the lifecycle implementation.
const visibility = createPromptVisibilityStore<Side>();
export const {
  setPromptMinimized: setChoiceModalMinimized,
  setPromptOpen: setChoiceModalOpen,
  usePromptMinimized: useChoiceModalMinimized,
  usePromptOpen: useChoiceModalOpen,
  usePromptExplicitlyClosed: useChoiceModalExplicitlyClosed,
  setPromptExpanded: setChoiceModalExpanded,
  usePromptExpanded: useChoiceModalExpanded,
  resetPromptStateForTests: resetChoiceModalStateForTests,
} = visibility;
