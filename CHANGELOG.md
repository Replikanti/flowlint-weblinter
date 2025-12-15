# Changelog

## 1.0.0 (2025-12-15)


### Features

* **ci:** setup automated release pipeline ([d492799](https://github.com/Replikanti/flowlint-weblinter/commit/d492799741b26f14bbd1807cbcae499c63447dc4))
* **ci:** setup release pipeline (release-please, automerge, renovate, polish) ([935ddb9](https://github.com/Replikanti/flowlint-weblinter/commit/935ddb956bf03b29529d8e9ef557a0708a6e0abf))
* initial implementation of web linter with tests ([83e072f](https://github.com/Replikanti/flowlint-weblinter/commit/83e072f997a2b429cb7ffd6d7ee072d66edb23a9))
* **weblinter:** complete setup with UI, CI/CD and release automation ([c6a5c53](https://github.com/Replikanti/flowlint-weblinter/commit/c6a5c53b7276e73720f3701efc7c0813ad8526c8))
* **weblinter:** complete setup with UI, CI/CD and release automation ([9607fa7](https://github.com/Replikanti/flowlint-weblinter/commit/9607fa7873010b0d5d34e0bdc239a7495bb65125))
* **weblinter:** complete setup with UI, CI/CD and release automation ([efb77b6](https://github.com/Replikanti/flowlint-weblinter/commit/efb77b644cd2a1680b440f7b094373bfc482d43f))
* **weblinter:** complete setup with UI, CI/CD and release automation ([fc59e30](https://github.com/Replikanti/flowlint-weblinter/commit/fc59e304bbe8787a426d514bdffe93c8a2dae67e))
* **weblinter:** complete setup with UI, CI/CD and release automation ([99fb035](https://github.com/Replikanti/flowlint-weblinter/commit/99fb035c46a4a299806c2574f383a80f44062a39))
* **weblinter:** complete setup with UI, CI/CD and release automation ([620e9e3](https://github.com/Replikanti/flowlint-weblinter/commit/620e9e3bdd467c14d5753a972edf943e83996af3))
* **weblinter:** complete UI implementation ([6dc1cc2](https://github.com/Replikanti/flowlint-weblinter/commit/6dc1cc2afc46592e3de041c0dc4799902c320238))
* **weblinter:** complete UI implementation matching main site with tests and CI ([b4ef7ea](https://github.com/Replikanti/flowlint-weblinter/commit/b4ef7ea0e920afe0199f93cf1911460202ac5972))


### Bug Fixes

* **build:** add missing tailwindcss-animate dependency and configure sonar exclusions ([58e1db3](https://github.com/Replikanti/flowlint-weblinter/commit/58e1db31ea6cf25e041d334cfad8cf14848789b0))
* **build:** resolve tailwindcss-animate and sonar issues ([2720d09](https://github.com/Replikanti/flowlint-weblinter/commit/2720d09e2d15852cdd17964911fa119ad3d6ab79))
* **ci:** correct vite config and eslint errors ([307a135](https://github.com/Replikanti/flowlint-weblinter/commit/307a135479479d54e70096b57c57da0428e67311))
* **ci:** fix typescript config for tests and refactor app state logic ([18ad37c](https://github.com/Replikanti/flowlint-weblinter/commit/18ad37ce6cd3c35a09e2dbf184084c19ab684e25))
* **ci:** rename build job to match other repositories ([c50676e](https://github.com/Replikanti/flowlint-weblinter/commit/c50676eded147744e81c24aa1ef79b808a3b45f6))
* **ci:** unify CI workflows ([d5419fc](https://github.com/Replikanti/flowlint-weblinter/commit/d5419fc21c6ccfa5d3d471c24ebb2c8e69817864))
* **sonar:** add broader exclusion for src/index.css ([f0e3c5f](https://github.com/Replikanti/flowlint-weblinter/commit/f0e3c5fac698d0cf9f9162274680dd5bc5908c3f))
* **sonar:** add broader exclusion for src/index.css to fix at-rule errors ([50f8e4c](https://github.com/Replikanti/flowlint-weblinter/commit/50f8e4cdf9f49c74c5db8cb00ed8a3b439ce5bdd))
* **sonar:** resolve code smells and false positives ([b007496](https://github.com/Replikanti/flowlint-weblinter/commit/b007496b08c6a85e3da5c28a9d09607c282446c6))
* **sonar:** update exclusion patterns for index.css ([285f7e3](https://github.com/Replikanti/flowlint-weblinter/commit/285f7e323a33a86da61c9a615a51d8763c96b3d9))
* **sonar:** update exclusion patterns for index.css to be more robust ([17a9e04](https://github.com/Replikanti/flowlint-weblinter/commit/17a9e04abfc01122c27583c00a78434eacfe3173))
* **sonar:** use node:path import and exclude index.css to avoid false positives ([fbc33c1](https://github.com/Replikanti/flowlint-weblinter/commit/fbc33c1edc4141d757945afd4003454404ce19f6))
* **ui:** match Header and Footer with flowlint.dev ([b61d0a5](https://github.com/Replikanti/flowlint-weblinter/commit/b61d0a5dd872cec2c0d70bd5c0cd6605a6c04a5e))
* **ui:** remove unused Github import from Header ([5a7a3d6](https://github.com/Replikanti/flowlint-weblinter/commit/5a7a3d6b6d7b33a32d1e8097ec7eca468015b34c))
* **ui:** remove unused Github import from Header ([78bd561](https://github.com/Replikanti/flowlint-weblinter/commit/78bd561f845dfaf7e5f02e0515652eb549fa9a07))
* **ui:** revert navigation menu positioning ([65689bf](https://github.com/Replikanti/flowlint-weblinter/commit/65689bf9a76dc4271b754521201906ae3dd525f1))
* **ui:** revert navigation menu positioning to match flowlint-web exactly ([00df186](https://github.com/Replikanti/flowlint-weblinter/commit/00df1863fdb33db16ef7b5f28b2d4dc3a1ca3c2f))
* **ui:** sync colors and header style with flowlint-web ([686971c](https://github.com/Replikanti/flowlint-weblinter/commit/686971c42f97bc153ea6a94e3449ee9cec13bfa0))
* **ui:** sync colors and theme variables with flowlint-web ([20016dd](https://github.com/Replikanti/flowlint-weblinter/commit/20016dd67eaf8972781ac1d2579d884123747455))
* **ui:** update Header/Footer to match main site exactly and install shadcn components ([cb3b737](https://github.com/Replikanti/flowlint-weblinter/commit/cb3b737db59528988676072ec7d5948e3f741e84))
