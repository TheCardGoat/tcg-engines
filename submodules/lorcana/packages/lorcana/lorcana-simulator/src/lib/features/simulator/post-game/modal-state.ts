export interface PostGameModalState {
  open: boolean;
  finishedGameKey: string | null;
  autoOpenedFinishedGameKey: string | null;
}

export function createInitialPostGameModalState(): PostGameModalState {
  return {
    open: false,
    finishedGameKey: null,
    autoOpenedFinishedGameKey: null,
  };
}

export function syncPostGameModalState(
  state: PostGameModalState,
  finishedGameKey: string | null,
): PostGameModalState {
  if (!finishedGameKey) {
    return {
      open: false,
      finishedGameKey: null,
      autoOpenedFinishedGameKey: null,
    };
  }

  if (state.autoOpenedFinishedGameKey === finishedGameKey) {
    return {
      ...state,
      finishedGameKey,
    };
  }

  return {
    open: true,
    finishedGameKey,
    autoOpenedFinishedGameKey: finishedGameKey,
  };
}

export function dismissPostGameModal(state: PostGameModalState): PostGameModalState {
  if (!state.finishedGameKey) {
    return state;
  }

  return {
    ...state,
    open: false,
  };
}

export function reopenPostGameModal(state: PostGameModalState): PostGameModalState {
  if (!state.finishedGameKey) {
    return state;
  }

  return {
    ...state,
    open: true,
  };
}
