import { Lockable } from '../lockable.js';
import { Locked } from '../locked.js';
import { ReleaseFunction } from '../release-function.js';
import { UnlockFunction } from '../unlock-function.js';

export class LockableFunction<GFunction extends (...args: any) => any> extends Lockable {
  readonly #fnc: GFunction;

  constructor(fnc: GFunction) {
    super();
    const self: this = this;

    this.#fnc = function (this: any): any {
      self.throwIfLocked();
      return Reflect.apply(fnc, this, arguments);
    } as GFunction;
  }

  get fnc(): GFunction {
    return this.#fnc;
  }

  override lock(): LockedFunction<GFunction> {
    const lock: Locked = super.lock();
    return new LockedFunction(this.#fnc, lock.unlock.bind(lock), lock.release.bind(lock));
  }
}

// export type InferFunctionThis<GFunction extends (...args: any) => any> = GFunction extends (
//     this: infer GThis,
//     ...args: any[]
//   ) => any
//   ? GThis
//   : never;


export class LockedFunction<GFunction extends (...args: any) => any> extends Locked {
  readonly #fnc: GFunction;

  /**
   * @private
   */
  constructor(fnc: GFunction, unlock: UnlockFunction, release: ReleaseFunction) {
    super(unlock, release);
    const self: this = this;
    this.#fnc =  function (this: any): any {
      return self.unlock((): any => {
        return Reflect.apply(fnc, this, arguments);
      });
    } as GFunction;
  }

  get fnc(): GFunction {
    return this.#fnc;
  }
}
