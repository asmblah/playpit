/*
 * Playpit - A simple JS sandbox for Node environments
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/playpit/
 *
 * Released under the MIT license
 * https://github.com/asmblah/playpit/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash');

/**
 * @param {class} Sandbox
 * @param {path} path
 * @param {fs} realFS
 * @param {Object.<string, object>} coreModules
 * @constructor
 */
function SandboxFactory(Sandbox, path, realFS, coreModules) {
    /**
     * @type {Object.<string, Object>|{}}
     */
    this.coreModules = coreModules || {};
    /**
     * @type {path}
     */
    this.path = path;
    /**
     * @type {fs}
     */
    this.realFS = realFS;
    /**
     * @type {class}
     */
    this.Sandbox = Sandbox;
}

_.extend(SandboxFactory.prototype, {
    /**
     * Creates a new Sandbox
     *
     * @param {fs} sandboxFS
     * @param {Object.<string, object>} coreModules
     * @returns {Sandbox}
     */
    create: function (sandboxFS, coreModules) {
        var factory = this,
            realFS = factory.realFS,
            // Create a bootstrap sandbox to load the `resolve` NPM library inside
            // but using the sandbox in-memory FS
            bootstrapSandbox = new factory.Sandbox(realFS, factory.path, function (path, basePath) {
                var resolvedPath = factory.path.resolve(basePath, path);

                if (realFS.existsSync(resolvedPath + '.js')) {
                    resolvedPath += '.js';
                } else if (realFS.existsSync(resolvedPath + '/index.js')) {
                    resolvedPath += '/index.js';
                }

                if (!realFS.existsSync(resolvedPath)) {
                    throw new Error('Could not resolve path "' + resolvedPath + '"');
                }

                return resolvedPath;
            }, {
                'fs': sandboxFS,
                'path': factory.path
            }),
            sandboxedResolve = bootstrapSandbox.execute(
                'module.exports = require(' + JSON.stringify(require.resolve('resolve')) + ');',
                __dirname
            );

        return new factory.Sandbox(
            sandboxFS,
            factory.path,
            function (path, basePath) {
                return sandboxedResolve.sync(path, {basedir: basePath});
            },
            _.extend({}, factory.coreModules, coreModules)
        );
    }
});

module.exports = SandboxFactory;
