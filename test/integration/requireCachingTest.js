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

describe('Require caching integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should return the same exports object the second time a module is required', function () {
        this.memoryFS.writeFileSync('/myinclude.js', 'module.exports = {abc: 123};');

        expect(this.sandbox.execute('module.exports = require("/myinclude.js");'))
            .to.equal(this.sandbox.execute('module.exports = require("/myinclude.js");'));
    });

    it('should return the same exports object the second time a module is required with an equivalent path', function () {
        this.memoryFS.writeFileSync('/myinclude.js', 'module.exports = {abc: 123};');

        expect(this.sandbox.execute('module.exports = require("/myinclude.js");'))
            .to.equal(this.sandbox.execute('module.exports = require("/././myinclude.js");'));
    });

    it('should make the exports value available via require.cache[...]', function () {
        this.memoryFS.writeFileSync('/myinclude.js', 'module.exports = 21;');

        this.sandbox.execute('require("/myinclude.js");');

        expect(
            this.sandbox.execute(
                'module.exports = require.cache["/myinclude.js"];'
            )
        ).to.equal(21);
    });

    it('should cache the entrypoint file\'s exports value in require.cache[...]', function () {
        this.sandbox.execute('module.exports = 27;', '/my/entry/file.js');

        expect(
            this.sandbox.execute(
                'module.exports = require.cache["/my/entry/file.js"];'
            )
        ).to.equal(27);
    });

    it('should not cache the entrypoint file\'s exports value if no path is provided', function () {
        this.sandbox.execute('module.exports = 27;');

        expect(this.sandbox.execute('module.exports = require.cache;')).to.deep.equal({});
    });

    it('should only evaluate the module once', function () {
        this.memoryFS.writeFileSync('/myinclude.js', 'myGlobal++;');

        // Require the module twice, it should only be executed once
        this.sandbox.execute('myGlobal = 1; require("/myinclude.js"); require("/myinclude.js");');

        expect(this.sandbox.execute('module.exports = myGlobal;')).to.equal(2);
    });
});
