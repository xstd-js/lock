import { describe, expect, it } from 'vitest';
import { Lockable } from './lockable.js';
import { Locked } from './locked.js';

describe('Lockable', (): void => {
  it('should works', (): void => {
    const lockable: Lockable = new Lockable();

    expect(lockable.locked).toBe(false);
    expect(() => lockable.throwIfLocked()).not.toThrow();

    const locked: Locked = lockable.lock();

    expect(lockable.locked).toBe(true);
    expect(() => lockable.throwIfLocked()).toThrow();
    expect(() => lockable.lock()).toThrow();
    expect(locked.released).toBe(false);
  });

  it('should not be locked on init', (): void => {
    const lockable: Lockable = new Lockable();
    expect(lockable.locked).toBe(false);
    expect(() => lockable.throwIfLocked()).not.toThrow();
  });

  it('should be lockable', (): void => {
    const lockable: Lockable = new Lockable();

    expect(lockable.locked).toBe(false);

    lockable.lock();
    expect(lockable.locked).toBe(true);
    expect(() => lockable.throwIfLocked()).toThrow();
  });

  it('should not be lockable twice without releasing the previous lock', (): void => {
    const lockable: Lockable = new Lockable();
    expect(() => lockable.lock()).not.toThrow();
    expect(() => lockable.lock()).toThrow();
  });

  it('should be unlockable', (): void => {
    const lockable: Lockable = new Lockable();

    const locked: Locked = lockable.lock();
    expect(lockable.locked).toBe(true);

    expect(
      locked.unlock((): 'unlocked' => {
        expect(lockable.locked).toBe(false);
        return 'unlocked';
      }),
    ).toBe('unlocked');
    expect(lockable.locked).toBe(true);
  });

  it('should be releasable', (): void => {
    const lockable: Lockable = new Lockable();

    const locked: Locked = lockable.lock();

    expect(lockable.locked).toBe(true);
    expect(locked.released).toBe(false);

    locked.release();

    expect(lockable.locked).toBe(false);
    expect(locked.released).toBe(true);
    expect(() => locked.unlock(() => {})).toThrow();

    expect(() => locked.release()).not.toThrow();
  });

  it('should be disposable', (): void => {
    const lockable: Lockable = new Lockable();

    {
      using locked: Locked = lockable.lock();

      expect(lockable.locked).toBe(true);
      expect(locked.released).toBe(false);
    }

    expect(lockable.locked).toBe(false);
  });

  it('should be lockable multiple times if we release the previous locks', (): void => {
    const lockable: Lockable = new Lockable();

    const lockedA: Locked = lockable.lock();
    expect(lockable.locked).toBe(true);

    lockedA.release();
    expect(lockable.locked).toBe(false);

    const lockedB: Locked = lockable.lock();
    expect(lockable.locked).toBe(true);

    lockedB.release();
    expect(lockable.locked).toBe(false);
  });
});
