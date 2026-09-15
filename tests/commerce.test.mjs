import test from 'node:test';
import assert from 'node:assert/strict';
import { cartItemKey, clampQuantity } from '../src/lib/commerce.js';

test('clampQuantity never exceeds available stock', () => {
  assert.equal(clampQuantity(8, 3), 3);
  assert.equal(clampQuantity(2, 3), 2);
  assert.equal(clampQuantity(-4, 3), 0);
});

test('cartItemKey separates variants of the same product', () => {
  assert.notEqual(cartItemKey('sofa', 'small'), cartItemKey('sofa', 'large'));
  assert.equal(cartItemKey('sofa'), 'sofa:default');
});
