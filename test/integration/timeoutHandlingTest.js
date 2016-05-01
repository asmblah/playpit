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

describe('Timeout handling integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should stop execution after the time limit has been exceeded by an infinite loop', function () {
        expect(function () {
            this.sandbox.execute(
                'while (true) {}',
                '/my/directory/myfile.js',
                {timeout: 500}
            );
        }.bind(this)).to.throw('Script execution timed out.');
    });
});
