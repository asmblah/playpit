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
 * @param {function} resolve
 * @param {Object.<string, object>} coreModules
 * @constructor
 */
function Sandbox(fs, path, resolve, coreModules) {
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
}

_.extend(Sandbox.prototype, {
    /**
     * Executes JavaScript code inside the sandbox
     *
     * @param {string} js
     * @param {string} directoryPath
     * @returns {{}} Returns module.exports from the module
     */
    execute: function (js, directoryPath) {
        var sandbox = this,
            moduleWrapper = new Function('require, module, exports, __dirname', js),
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

                return sandbox.execute(contents, sandbox.path.dirname(resolvedPath));
            },
            exports = {},
            module = {
                exports: exports
            };

        moduleWrapper(require, module, exports, directoryPath);

        return module.exports;
    }
});

module.exports = Sandbox;
