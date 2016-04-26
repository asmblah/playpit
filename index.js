/*
 * Playpit - A simple JS sandbox for Node environments
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/playpit/
 *
 * Released under the MIT license
 * https://github.com/asmblah/playpit/raw/master/MIT-LICENSE.txt
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    vm = require('vm'),
    Sandbox = require('./src/Sandbox'),
    SandboxFactory = require('./src/SandboxFactory'),
    sandboxFactory = new SandboxFactory(Sandbox, path, fs, vm);

module.exports = sandboxFactory;
