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

describe('Circular dependency integration', function () {
    beforeEach(function () {
        this.memoryFS = mockFS.fs();
        this.sandbox = require('../..').create(this.memoryFS);
    });

    it('should support two files require()-ing each other with default exports objects', function () {
        var result;
        this.memoryFS.writeFileSync('/file1.js', 'exports.other = require("/file2.js"); exports.me = 1;');
        this.memoryFS.writeFileSync('/file2.js', 'exports.other = require("/file1.js"); exports.me = 2;');

        result = this.sandbox.execute(
            'module.exports = {file1: require("/file1"), file2: require("/file2")};',
            '/myscript.js'
        );

        expect(result.file1.me).to.equal(1);
        expect(result.file1.other).to.equal(result.file2);
        expect(result.file2.me).to.equal(2);
        expect(result.file2.other).to.equal(result.file1);
    });

    it('should support two files require()-ing each other with custom exports objects', function () {
        var result;
        this.memoryFS.writeFileSync('/file1.js', 'module.exports = {val: 21}; module.exports.other = require("/file2.js");');
        this.memoryFS.writeFileSync('/file2.js', 'module.exports = {val: 27}; module.exports.other = require("/file1.js");');

        result = this.sandbox.execute(
            'module.exports = {file1: require("/file1"), file2: require("/file2")};',
            '/myscript.js'
        );

        expect(result.file1.val).to.equal(21);
        expect(result.file1.other).to.equal(result.file2);
        expect(result.file2.val).to.equal(27);
        expect(result.file2.other).to.equal(result.file1);
    });
});
