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

describe('Exports integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should allow module.exports to be replaced', function () {
        expect(this.sandbox.execute('module.exports = 21;')).to.equal(21);
    });

    it('should allow exports to be extended', function () {
        expect(this.sandbox.execute('exports.myProp = 27;')).to.deep.equal({
            myProp: 27
        });
    });
});
