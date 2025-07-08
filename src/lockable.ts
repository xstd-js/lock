import { Locked } from './locked.js';

/**
 * Creates a "lockable" reference.
 */
export class Lockable {
  #locked: boolean;
  #lock: Locked | undefined;

  constructor() {
    this.#locked = false;
  }

  /**
   * If this `Lockable` is locked or not.
   */
  get locked(): boolean {
    return this.#locked;
  }

  /**
   * Throws if this `Lockable` is locked.
   */
  throwIfLocked(): void {
    if (this.#locked) {
      throw new Error('Locked.');
    }
  }

  /**
   * Creates a lock on this `Lockable`:
   *  - this `Lockable` is _locked_ until `Locked.release` is called
   */
  lock(): Locked {
    if (this.#lock === undefined) {
      this.#locked = true;
      return (this.#lock = new Locked(
        <GReturn>(context: () => GReturn): GReturn => {
          this.#locked = false;
          try {
            return context();
          } finally {
            this.#locked = true;
          }
        },
        (): void => {
          this.#locked = false;
          this.#lock = undefined;
        },
      ));
    } else {
      throw new Error('A lock already exists. You must `release` it first.');
    }
  }
}
