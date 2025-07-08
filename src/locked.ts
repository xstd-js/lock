import { type ReleaseFunction } from './release-function.js';
import { type UnlockFunction } from './unlock-function.js';

/**
 * Creates a "lock" on a resource.
 * @private
 */
export class Locked {
  #unlock: UnlockFunction;
  #release: ReleaseFunction;
  #released: boolean;

  /**
   * @private
   */
  constructor(unlock: UnlockFunction, release: ReleaseFunction) {
    this.#unlock = unlock;
    this.#release = release;
    this.#released = false;
  }

  /**
   * If this `Locked` is released or not.
   */
  get released(): boolean {
    return this.#released;
  }

  /**
   * Unlocks temporally this `Locked`:
   *  - unlock the associated `Lockable`
   *  - runs `context`
   *  - finally re-lock the associated `Lockable`
   */
  unlock<GReturn>(context: () => GReturn): GReturn {
    if (this.#released) {
      throw new Error('Released.');
    }
    return this.#unlock(context);
  }

  /**
   * Releases this `Locked`.
   */
  release(): void {
    if (!this.#released) {
      this.#released = true;
      this.#release();
    }
  }

  /**
   * Disposes of this `Locked` (releases it).
   */
  [Symbol.dispose](): void {
    this.release();
  }
}
