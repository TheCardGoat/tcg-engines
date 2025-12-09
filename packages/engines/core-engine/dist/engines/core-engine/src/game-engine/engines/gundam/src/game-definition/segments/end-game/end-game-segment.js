export const endGameSegment = {
    onBegin: ({ G }) => G,
    endIf: () => true,
    next: undefined,
    turn: {
        onBegin: ({ G }) => G,
        onEnd: ({ G }) => G,
    },
};
//# sourceMappingURL=end-game-segment.js.map