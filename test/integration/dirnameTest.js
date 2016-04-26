/*
 * Playpit - A simple JS sandbox for Node environments
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/playpit/
 *
 * Released under the MIT license
 * https://github.com/asmblah/playpit/raw/master/MIT-LICENSE.txt
 */

'use strict';

var MemoryFileSystem = require('memory-fs');

describe('Dirname integration', function () {
    beforeEach(function () {
        this.memoryFS = new MemoryFileSystem();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should expose the provided top-level directory path', function () {
        expect(
            this.sandbox.execute(
                'module.exports = "dir: [" + __dirname + "]";',
                '/my/directory/myfile.js'
            )
        ).to.equal('dir: [/my/directory]');
    });

    it('should expose the correct directory path inside a sub-required module', function () {
        this.memoryFS.mkdirpSync('/another/dir/');
        this.memoryFS.writeFileSync('/another/dir/script.js', 'module.exports = "dir: [" + __dirname + "]";');

        expect(
            this.sandbox.execute(
                'module.exports = "other-dir: [" + require("/another/dir/script") + "]";',
                '/my/directory/myfile.js'
            )
        ).to.equal('other-dir: [dir: [/another/dir]]');
    });
});
