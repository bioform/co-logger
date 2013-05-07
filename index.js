var fs = require('fs');
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true, colorize: true, prettyPrint: true }),
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true, colorize: true, prettyPrint: true }),
  ],
  exitOnError: true
});

// remove compound colorization for file transport
var old_log = winston.transports.File.prototype.log;
winston.transports.File.prototype.log = function (level, msg, meta, callback) {
	msg = msg.replace(/\u001b\[\d{1,3}m/g, '');
	old_log.call(this, level, msg, meta, callback);
};

// add "write" method for compatibility with old compound logger
logger.write = function(str){
	this.info(str);
}

// init logger with compound
logger.init = function(compound){
	if( !compound || !compound.root || !compound.app || typeof compound.app.set !== 'function'){
		throw "'compound' object should be defined";
	}
	compound.logger = this;

	var logsDir = compound.root + '/log';
	var logFile = compound.app.set('env') + '.log'

	var addTransport = function(){
		this.add(winston.transports.File, {
			filename: logsDir + '/' + logFile,
			handleExceptions: true,
			prettyPrint: true,
			json: false
		});
	}.bind(this);

	
	try {
		if ( !fs.existsSync(logsDir) ){
			fs.mkdirSync( logsDir );
			addTransport();
		}
		else {
			var stats = fs.statSync( logsDir );
			if ( !stats.isDirectory() ){
				this.error('Cannot create log directory. File with the same name is already exists');
			}
			else {
				// Directory is already exists
				addTransport();
			}
		}
	}
	catch( err ){
		this.error('Cannot create log directory. ' + err);
	}
};

module.exports = logger;