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

describe('Hashbang handling integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should execute top-level code with a leading hashbang line', function () {
        expect(
            this.sandbox.execute('#!/bin/sh\nmodule.exports = 21;')
        ).to.equal(21);
    });

    it('should execute a required module with a leading hashbang line', function () {
        this.memoryFS.mkdirSync('/another/');
        this.memoryFS.mkdirSync('/another/dir/');
        this.memoryFS.writeFileSync('/another/dir/script.js', '#!/bin/sh\nmodule.exports = 21;');

        expect(
            this.sandbox.execute('module.exports = require("/another/dir/script") + 6;')
        ).to.equal(27);
    });
});
