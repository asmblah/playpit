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

describe('External require integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should support requiring a module inside the sandbox externally, with an absolute path', function () {
        this.memoryFS.mkdirSync('/another/');
        this.memoryFS.mkdirSync('/another/dir/');
        this.memoryFS.writeFileSync('/another/dir/script.js', 'module.exports = 27;');

        expect(this.sandbox.require('/another/dir/script')).to.equal(27);
    });

    it('should support requiring a module inside the sandbox externally, with an relative path', function () {
        this.memoryFS.mkdirSync('/another/');
        this.memoryFS.mkdirSync('/another/dir/');
        this.memoryFS.writeFileSync('/another/dir/script.js', 'module.exports = 21;');

        expect(this.sandbox.require('./script', '/another/dir')).to.equal(21);
    });
});
