export interface PostGameRecordRequestState {
  requestedGameId: string | null;
  loadedGameId: string | null;
}

export function createInitialPostGameRecordRequestState(): PostGameRecordRequestState {
  return {
    requestedGameId: null,
    loadedGameId: null,
  };
}

export function resetPostGameRecordRequestStateForGame(
  current: PostGameRecordRequestState,
  gameId: string,
): PostGameRecordRequestState {
  if (current.requestedGameId === gameId || current.loadedGameId === gameId) {
    return current;
  }

  return createInitialPostGameRecordRequestState();
}

export function clearRequestedPostGameRecord(
  current: PostGameRecordRequestState,
): PostGameRecordRequestState {
  if (current.requestedGameId === null) {
    return current;
  }

  return {
    ...current,
    requestedGameId: null,
  };
}

export function markPostGameRecordRequested(
  current: PostGameRecordRequestState,
  gameId: string,
): PostGameRecordRequestState {
  if (current.requestedGameId === gameId) {
    return current;
  }

  return {
    ...current,
    requestedGameId: gameId,
  };
}

export function markPostGameRecordLoaded(
  current: PostGameRecordRequestState,
  gameId: string,
): PostGameRecordRequestState {
  if (current.requestedGameId === gameId && current.loadedGameId === gameId) {
    return current;
  }

  return {
    requestedGameId: gameId,
    loadedGameId: gameId,
  };
}

export function shouldAutoLoadPostGameRecord(args: {
  open: boolean;
  gameId: string;
  requestState: PostGameRecordRequestState;
  isLoading: boolean;
}): boolean {
  const { open, gameId, requestState, isLoading } = args;

  if (!open || gameId.length === 0 || isLoading) {
    return false;
  }

  return requestState.requestedGameId !== gameId;
}
