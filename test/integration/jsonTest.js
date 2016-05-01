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

describe('JSON file integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should support require()-ing a JSON file', function () {
        this.memoryFS.mkdirSync('/my/');
        this.memoryFS.mkdirSync('/my/dir/');
        this.memoryFS.writeFileSync('/my/dir/data.json', JSON.stringify({abc: 123}));

        expect(
            this.sandbox.execute(
                'module.exports = require("/my/dir/data.json");',
                '/my/directory/myfile.js'
            )
        ).to.deep.equal({abc: 123});
    });
});
