import { describe, expect, it } from "bun:test";

import {
  ManualInMemoryTransportScheduler,
  createInMemoryTransportPair,
} from "./in-memory-transport";

const RTT_BROWSER_TRANSPORT = {
  mode: "async" as const,
  latencyMs: 250,
  latencyModel: "rtt" as const,
};

describe("in-memory transport", () => {
  it("keeps SYNC_REQUEST synchronous in async mode", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: RTT_BROWSER_TRANSPORT,
      scheduler,
    });
    const messages: string[] = [];

    transportPair.server.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.client.send({
      type: "SYNC_REQUEST",
      protocolVersion: 4,
      matchID: "match-1",
    });

    expect(messages).toEqual(["SYNC_REQUEST"]);
    scheduler.advanceBy(1_000);
    expect(messages).toEqual(["SYNC_REQUEST"]);
  });

  it("keeps SYNC_FULL synchronous in async mode", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: RTT_BROWSER_TRANSPORT,
      scheduler,
    });
    const messages: string[] = [];

    transportPair.client.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.server.simulateReceive({
      type: "SYNC_FULL",
      stateID: 1,
      canUndo: false,
      state: {} as never,
      protocolVersion: 4,
      matchID: "match-1",
    });

    expect(messages).toEqual(["SYNC_FULL"]);
    scheduler.advanceBy(1_000);
    expect(messages).toEqual(["SYNC_FULL"]);
  });

  it("delays UPDATE_ACTION by one RTT leg", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: RTT_BROWSER_TRANSPORT,
      scheduler,
    });
    const messages: string[] = [];

    transportPair.server.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.client.send({
      type: "UPDATE_ACTION",
      protocolVersion: 4,
      matchID: "match-1",
      prevStateID: 0,
      command: {
        commandID: "cmd-1",
        move: "passTurn",
        input: { args: {} },
      },
    });

    expect(messages).toEqual([]);
    scheduler.advanceBy(124);
    expect(messages).toEqual([]);
    scheduler.advanceBy(1);
    expect(messages).toEqual(["UPDATE_ACTION"]);
  });

  it("keeps async zero-latency transport off the current call stack", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: {
        mode: "async",
        latencyMs: 0,
        latencyModel: "one-way",
      },
      scheduler,
    });
    const messages: string[] = [];

    transportPair.server.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.client.send({
      type: "UPDATE_ACTION",
      protocolVersion: 4,
      matchID: "match-1",
      prevStateID: 0,
      command: {
        commandID: "cmd-1",
        move: "passTurn",
        input: { args: {} },
      },
    });

    expect(messages).toEqual([]);
    scheduler.advanceBy(0);
    expect(messages).toEqual(["UPDATE_ACTION"]);
  });

  it("delays UPDATE_FULL, UPDATE_PATCH, and ERROR by one server leg", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: RTT_BROWSER_TRANSPORT,
      scheduler,
    });
    const messages: string[] = [];

    transportPair.client.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.server.simulateReceive({
      type: "UPDATE_FULL",
      stateID: 1,
      canUndo: false,
      processedCommand: {
        commandID: "cmd-1",
        move: "passTurn",
      },
      animations: [],
      state: {} as never,
      protocolVersion: 4,
      matchID: "match-1",
    });
    transportPair.server.simulateReceive({
      type: "UPDATE_PATCH",
      prevStateID: 1,
      stateID: 2,
      canUndo: false,
      patchFormat: "immer",
      patchOps: [],
      processedCommand: {
        commandID: "cmd-2",
        move: "passTurn",
      },
      animations: [],
      protocolVersion: 4,
      matchID: "match-1",
    });
    transportPair.server.simulateReceive({
      type: "ERROR",
      code: "INVALID_MOVE",
      message: "Command failed",
      protocolVersion: 4,
      matchID: "match-1",
    });

    expect(messages).toEqual([]);
    scheduler.advanceBy(125);
    expect(messages).toEqual(["UPDATE_FULL"]);
    scheduler.advanceBy(125);
    expect(messages).toEqual(["UPDATE_FULL", "UPDATE_PATCH"]);
    scheduler.advanceBy(125);
    expect(messages).toEqual(["UPDATE_FULL", "UPDATE_PATCH", "ERROR"]);
  });

  it("preserves FIFO ordering for queued same-direction messages", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: RTT_BROWSER_TRANSPORT,
      scheduler,
    });
    const commandIds: string[] = [];

    transportPair.server.onMessage((message) => {
      commandIds.push((message as unknown as { command: { commandID: string } }).command.commandID);
    });

    transportPair.client.send({
      type: "UPDATE_ACTION",
      protocolVersion: 4,
      matchID: "match-1",
      prevStateID: 0,
      command: {
        commandID: "cmd-1",
        move: "passTurn",
        input: { args: {} },
      },
    });
    transportPair.client.send({
      type: "UPDATE_ACTION",
      protocolVersion: 4,
      matchID: "match-1",
      prevStateID: 0,
      command: {
        commandID: "cmd-2",
        move: "passTurn",
        input: { args: {} },
      },
    });

    scheduler.advanceBy(125);
    expect(commandIds).toEqual(["cmd-1"]);
    scheduler.advanceBy(124);
    expect(commandIds).toEqual(["cmd-1"]);
    scheduler.advanceBy(1);
    expect(commandIds).toEqual(["cmd-1", "cmd-2"]);
  });

  it("uses full latency for one-way mode", () => {
    const scheduler = new ManualInMemoryTransportScheduler();
    const transportPair = createInMemoryTransportPair({
      browserTransport: {
        mode: "async",
        latencyMs: 80,
        latencyModel: "one-way",
      },
      scheduler,
    });
    const messages: string[] = [];

    transportPair.server.onMessage((message) => {
      messages.push(message.type);
    });

    transportPair.client.send({
      type: "UNDO_REQUEST",
      prevStateID: 0,
      protocolVersion: 4,
      matchID: "match-1",
    });

    scheduler.advanceBy(79);
    expect(messages).toEqual([]);
    scheduler.advanceBy(1);
    expect(messages).toEqual(["UNDO_REQUEST"]);
  });
});
