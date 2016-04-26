TODO
====

- Implement require.resolve
- Allow native modules to be provided lazily by specifying a callback function for each
  rather than needing all of them to be loaded in first.
- Load NPM inside the sandbox so that an entire package and/or its dependency tree can be loaded in-memory.
- Ignore hashbangs when evaling code
- Dump path to dependency-of-dependency that tries to require a module but fails
