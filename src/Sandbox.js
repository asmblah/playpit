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
     * @returns {{}} Returns module.exports from the module
     */
    execute: function (js, filePath) {
        var sandbox = this,
            directoryPath = sandbox.path.dirname(filePath),
            require = function (path) {
                var contents,
                    resolvedPath;

                if (hasOwn.call(sandbox.coreModules, path)) {
                    return sandbox.coreModules[path];
                }

                resolvedPath = sandbox.resolve(path, directoryPath);
                contents = sandbox.fs.readFileSync(resolvedPath);

                if (/\.json$/.test(path)) {
                    return JSON.parse(contents);
                }

                return sandbox.execute(contents, resolvedPath);
            },
            exports = {},
            module = {
                exports: exports
            },
            moduleWrapper = sandbox.vm.runInContext(
                '(function (require, module, exports, __dirname) {\n' + js + '\n})',
                sandbox.contextSandbox
            );

        moduleWrapper(require, module, exports, directoryPath);

        return module.exports;
    }
});

module.exports = Sandbox;
