import { describe, expect, it } from 'vitest';
import { LockableFunction, LockedFunction } from './lockable-function.js';

describe('LockableFunction', (): void => {
  type AddFunction = (a: number, b: number) => number;
  const add: AddFunction = (a: number, b: number): number => {
    return a + b;
  };

  it('should works', (): void => {
    const lockable = new LockableFunction(add);

    expect(lockable.locked).toBe(false);
    expect(lockable.fnc(1, 2)).toBe(3);

    const locked: LockedFunction<AddFunction> = lockable.lock();

    expect(lockable.locked).toBe(true);
    expect(() => lockable.fnc(1, 2)).toThrow();
    expect(locked.fnc(1, 2)).toBe(3);
  });
});
