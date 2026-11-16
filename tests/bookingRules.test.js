// Automated test for Rule 1 (capacity): 1-3 people per session, never above seats left.
// Run with: npm test   (or: node --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAttendees, MAX_ATTENDEES_PER_SESSION } from "../src/rules/bookingRules.js";

test("valid: 2 people when 10 seats are left is accepted", () => {
  const result = checkAttendees(2, 10);
  assert.equal(result.ok, true);
  assert.equal(result.max, MAX_ATTENDEES_PER_SESSION);
});

test("boundary: exactly 3 people (the limit) is accepted", () => {
  const result = checkAttendees(3, 10);
  assert.equal(result.ok, true);
});

test("breaks rule: 4 people is rejected with a specific message", () => {
  const result = checkAttendees(4, 10);
  assert.equal(result.ok, false);
  assert.equal(result.code, "over-limit");
  assert.match(result.message, /up to 3 people/);
});

test("breaks rule: more people than seats left is rejected", () => {
  const result = checkAttendees(3, 2);
  assert.equal(result.ok, false);
  assert.equal(result.code, "over-capacity");
  assert.equal(result.max, 2);
});

test("boundary: exactly the seats left (2 of 2) is accepted", () => {
  assert.equal(checkAttendees(2, 2).ok, true);
});

test("breaks rule: a full session (0 seats) rejects any booking", () => {
  const result = checkAttendees(1, 0);
  assert.equal(result.ok, false);
  assert.equal(result.code, "full");
});

test("breaks rule: zero people is rejected", () => {
  assert.equal(checkAttendees(0, 5).code, "too-few");
});
