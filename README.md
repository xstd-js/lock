[![npm (scoped)](https://img.shields.io/npm/v/@xstd/lock.svg)](https://www.npmjs.com/package/@xstd/lock)
![npm](https://img.shields.io/npm/dm/@xstd/lock.svg)
![NPM](https://img.shields.io/npm/l/@xstd/lock.svg)
![npm type definitions](https://img.shields.io/npm/types/@xstd/lock.svg)
![coverage](https://img.shields.io/badge/coverage-100%25-green)

<picture>
  <source height="64" media="(prefers-color-scheme: dark)" srcset="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-dark.png?raw=true">
  <source height="64" media="(prefers-color-scheme: light)" srcset="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-light.png?raw=true">
  <img height="64" alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://github.com/xstd-js/website/blob/main/assets/logo/png/logo-large-light.png?raw=true">
</picture>

## @xstd/lock

Classes to manage locks on execution contexts.

## 📦 Installation

```shell
yarn add @xstd/lock
# or
npm install @xstd/lock --save
```

## 📜 Documentation

```ts
// resource.ts
import { Lockable } from '@xstd/lock';

class Resource {
  readonly closeClock: Lockable = new Lockable();
  
  close(): void {
    this.closeClock.throwIfLocked();
    // ... close the Resource
  }
}
```

```ts
// main.ts
import { Resource } from './resource';

const resource = new Resource();
// => currently, everyone may call `resource.close()`

// let's create a lock on `resource.close` to prevent this behavior
const lock = resource.closeClock.lock();
// => now, calling `resource.close()` will throw an error

// thanks to our lock, we may safely share `resource` and be sure that `resource.close()` will never be called
consume(resource);

// ... later ...

// to close the resource, we must run it inside the `lock.unlock` context
lock.unlock(() => resource.close());

// finally, we release the lock
lock.release();
```
