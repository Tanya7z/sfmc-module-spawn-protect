import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldApplyResistance } from "../sapi/src/protect.ts";

describe("spawn-protect resistance guard", () => {
  it("无已有效果时允许施加", () => {
    assert.equal(shouldApplyResistance(undefined, undefined), true);
  });

  it("已有更高 amplifier 时不缩减", () => {
    assert.equal(shouldApplyResistance(6, 20), false);
  });

  it("同等 amp 且剩余时长更长时不缩减", () => {
    assert.equal(shouldApplyResistance(5, 120), false);
  });

  it("更低 amp 时允许覆盖提升", () => {
    assert.equal(shouldApplyResistance(2, 200), true);
  });
});
