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

describe('Call stack limit handling integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
        this.RangeError = this.sandbox.execute('module.exports = RangeError;');
    });

    it('should stop execution after the call stack size limit has been exceeded by infinite recursion', function () {
        expect(function () {
            this.sandbox.execute(
                'function inception() { inception(); } inception();',
                '/my/directory/myfile.js'
            );
        }.bind(this)).to.throw(this.RangeError, 'Maximum call stack size exceeded');
    });
});
