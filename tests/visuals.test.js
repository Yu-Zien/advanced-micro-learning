import test from "node:test";
import assert from "node:assert/strict";
import { budgetGeometry, convexMix, costGeometry } from "../src/visuals.js";

test("预算图截距与斜率和预算方程一致", () => {
  const value = budgetGeometry(2, 1, 6);
  assert.equal(value.x1Intercept, 3);
  assert.equal(value.x2Intercept, 6);
  assert.equal(value.slope, -2);
});

test("严格凸示例的内部混合优于两个无差异端点", () => {
  const middle = convexMix(0.5);
  assert.equal(middle.endpointUtility, 4);
  assert.equal(middle.mix.x1, 2.5);
  assert.equal(middle.mix.x2, 2.5);
  assert.ok(middle.mixUtility > middle.endpointUtility);
});

test("成本图在有效规模处满足 AC 等于 MC", () => {
  const value = costGeometry(16);
  assert.equal(value.efficientScale, 4);
  assert.equal(value.minimumAverageCost, 8);
  assert.equal(value.marginalCost, 8);
});
