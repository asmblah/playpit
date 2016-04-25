'use strict';

var sandboxFactory = require('..'),
    MemoryFS = require('memory-fs'),
    memoryFS = new MemoryFS(),
    sandbox = sandboxFactory.create(memoryFS);

memoryFS.mkdirpSync('/my/dir');
memoryFS.writeFileSync(
    '/my/dir/file1.js',
    'console.log("File1"); require("./file2.js"); console.log("Then"); require("/my/dir"); console.log("End");'
);
memoryFS.writeFileSync(
    '/my/dir/index.js',
    'console.log("Index");'
);
memoryFS.writeFileSync(
    '/my/dir/file2.js',
    'console.log("File2");'
);

sandbox.execute('require("/my/dir/file1");');
