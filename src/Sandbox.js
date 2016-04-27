/*
 * Playpit - A simple JS sandbox for Node environments
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/playpit/
 *
 * Released under the MIT license
 * https://github.com/asmblah/playpit/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash'),
    hasOwn = {}.hasOwnProperty;

/**
 * @param {fs} fs
 * @param {path} path
 * @param {vm} vm
 * @param {pbject} contextSandbox
 * @param {function} resolve
 * @param {Object.<string, object>} coreModules
 * @constructor
 */
function Sandbox(fs, path, vm, contextSandbox, resolve, coreModules) {
    /**
     * @type {pbject}
     */
    this.contextSandbox = contextSandbox;
    /**
     * @type {Object.<string, Object>}
     */
    this.coreModules = coreModules;
    /**
     * @type {fs}
     */
    this.fs = fs;
    /**
     * @type {path}
     */
    this.path = path;
    /**
     * @type {{}}
     */
    this.requireCache = {};
    /**
     * @type {Function}
     */
    this.resolve = resolve;
    /**
     * @type {vm}
     */
    this.vm = vm;
}

_.extend(Sandbox.prototype, {
    /**
     * Executes JavaScript code inside the sandbox
     *
     * @param {string} js
     * @param {string} filePath
     * @param {object} options
     * @returns {{}} Returns module.exports from the module
     */
    execute: function (js, filePath, options) {
        var sandbox = this,
            allOptions = _.extend({timeout: 2000}, options),
            resolvedFilePath = filePath || null,
            directoryPath = resolvedFilePath ? sandbox.path.dirname(resolvedFilePath) : null,
            require = function (path) {
                return sandbox.require(path, directoryPath);
            },
            exports = {},
            module = {
                exports: exports
            },
            moduleCode;

        // Remove any hashbang
        js = js.replace(/^#!.*/, '');

        // Wrap the module in the CommonJS wrapper function
        moduleCode = JSON.stringify('(function (require, module, exports, __dirname) {\n' + js + '\n})');

        // Expose the require cache as require.cache[...]
        require.cache = sandbox.requireCache;

        if (filePath) {
            // Cache the module's initial exports object to support circular dependencies
            sandbox.requireCache[filePath] = exports;
        }

        // Execute inside another VM context to allow the timeout to be applied
        sandbox.vm.runInNewContext(
            '(vm.runInContext(' +
                moduleCode +
            ', contextSandbox, ' + JSON.stringify({filename: resolvedFilePath || '<sandboxed script>'}) + '))' +
            '(require, module, exports, directoryPath)',
            {
                contextSandbox: sandbox.contextSandbox,
                vm: sandbox.vm,
                require: require,
                module: module,
                exports: exports,
                directoryPath: directoryPath
            },
            {
                displayErrors: false,
                timeout: allOptions.timeout
            }
        );

        if (filePath) {
            // Cache the module's final exports object to prevent them needing to be re-evaluated
            sandbox.requireCache[filePath] = module.exports;
        }

        return module.exports;
    },

    /**
     * Requires a module from inside the sandbox
     *
     * @param {string} path
     * @param {string|null} basePath
     * @returns {*}
     */
    require: function (path, basePath) {
        var contents,
            resolvedPath,
            sandbox = this;

        // Core modules take precedence if there is a match
        if (hasOwn.call(sandbox.coreModules, path)) {
            return sandbox.coreModules[path];
        }

        resolvedPath = sandbox.resolve(path, basePath || '');

        // Fetch the module's exports from the cache if present
        if (hasOwn.call(sandbox.requireCache, resolvedPath)) {
            return sandbox.requireCache[resolvedPath];
        }

        if (!sandbox.fs.existsSync(resolvedPath)) {
            throw new Error('Cannot find module with path "' + resolvedPath + '"');
        }

        contents = sandbox.fs.readFileSync(resolvedPath).toString();

        // Load JSON files (with the `.json` extension) in and parse as JSON
        if (/\.json$/.test(path)) {
            return JSON.parse(contents);
        }

        return sandbox.execute(contents, resolvedPath);
    }
});

module.exports = Sandbox;
