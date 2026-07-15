export interface PostGameModalState {
  open: boolean;
  finishedGameKey: string | null;
}

export function createInitialPostGameModalState(): PostGameModalState {
  return {
    open: false,
    finishedGameKey: null,
  };
}

export function syncPostGameModalState(
  state: PostGameModalState,
  finishedGameKey: string | null,
): PostGameModalState {
  if (!finishedGameKey) {
    if (!state.finishedGameKey && !state.open) return state;
    return {
      open: false,
      finishedGameKey: null,
    };
  }

  if (state.finishedGameKey === finishedGameKey) {
    return state;
  }

  return {
    open: true,
    finishedGameKey,
  };
}

export function closePostGameModal(state: PostGameModalState): PostGameModalState {
  if (!state.open) return state;
  return { ...state, open: false };
}

export function openPostGameModal(state: PostGameModalState): PostGameModalState {
  if (state.open) return state;
  return { ...state, open: true };
}
