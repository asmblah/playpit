/*
 * Playpit - A simple JS sandbox for Node environments
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/playpit/
 *
 * Released under the MIT license
 * https://github.com/asmblah/playpit/raw/master/MIT-LICENSE.txt
 */

'use strict';

var mockFS = require('mock-fs');

describe('Exposing globals integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
    });

    it('should support exposing a custom `console` global', function () {
        this.sandbox = require('../..').create(this.memoryFS, {}, {
            console: 21
        });

        expect(
            this.sandbox.execute(
                'module.exports = console;',
                '/my/dir/script.js'
            )
        ).to.equal(21);
    });

    it('should support exposing a custom `process` global', function () {
        this.sandbox = require('../..').create(this.memoryFS, {}, {
            process: 21
        });

        expect(
            this.sandbox.execute(
                'module.exports = process;',
                '/my/dir/script.js'
            )
        ).to.equal(21);
    });

    it('should expose the `global` global, pointing to the sandbox\'s global object', function () {
        var globalFromVar = this.sandbox.execute('module.exports = global;'),
            globalFromThis = this.sandbox.execute('module.exports = this;');

        expect(globalFromVar).to.equal(globalFromThis);
    });
});
