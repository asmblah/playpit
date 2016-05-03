'use strict';

var sandboxFactory = require('..'),
    mockFS = require('mock-fs').fs(),
    sandbox = sandboxFactory.create(mockFS);

mockFS.mkdirSync('/my');
mockFS.mkdirSync('/my/dir');
mockFS.writeFileSync(
    '/my/dir/file1.js',
    'console.log("File1"); require("./file2.js"); console.log("Then"); require("/my/dir"); console.log("End");'
);
mockFS.writeFileSync(
    '/my/dir/index.js',
    'console.log("Index");'
);
mockFS.writeFileSync(
    '/my/dir/file2.js',
    'console.log("File2");'
);

sandbox.execute('require("/my/dir/file1");');
