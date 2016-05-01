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

describe('Filename integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should expose the provided top-level entrypoint file path', function () {
        expect(
            this.sandbox.execute(
                'module.exports = "file: [" + __filename + "]";',
                '/my/directory/myfile.js'
            )
        ).to.equal('file: [/my/directory/myfile.js]');
    });

    it('should expose the correct path of a sub-required module', function () {
        this.memoryFS.mkdirSync('/another/');
        this.memoryFS.mkdirSync('/another/dir/');
        this.memoryFS.writeFileSync('/another/dir/script.js', 'module.exports = "file: [" + __filename + "]";');

        expect(
            this.sandbox.execute(
                'module.exports = "other-file: [" + require("/another/dir/script") + "]";',
                '/my/directory/myfile.js'
            )
        ).to.equal('other-file: [file: [/another/dir/script.js]]');
    });
});
