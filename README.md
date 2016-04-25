Playpit
=======

A simple JS sandbox for Node environments.

Installing
----------
```shell
$ npm install --save playpit memory-fs
```

```javascript
var MemoryFS = require('memory-fs'),
    memoryFS = new MemoryFS(),
    playpit = require('playpit').create(memoryFS);

memoryFS.writeFileSync('/test.js', 'console.log("Hello!")');
playpit.execute('require("/test.js");');
```

```shell
Hello!
```


Try the example
---------------
```shell
$ npm install
$ node demo/simple

File1
File2
Then
Index
End
```
