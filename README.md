co-logger
=========

Winston based logger for [compound.js](https://github.com/1602/compound)

Replace default CompoundJS logger with [Winston](https://github.com/flatiron/winston/)

Installation
============

Step 1. install using npm:

    npm install co-logger --save

Step 2. add `co-logger` to `config/autoload.js`, for example:

```javascript
module.exports = function (compound) {
    return [
        'ejs-ext',
        'jugglingdb',
        'seedjs',
        'co-logger'
    ].map(require);
};
```

Usages
======

You can use co-logger with old way:

```javascript
compound.logger.write("My log message")
```

Or:

```javascript
log = require("co-logger");
log.debug("My log message");
log.error("My log message with error", err);
```

Or:

```javascript
compound.logger.warn("My log message");
```
