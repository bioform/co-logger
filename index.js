var fs = require('fs');
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
  ],
  exitOnError: false
});

logger.write = function(str){
	this.debug(str);
}

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
			json: false
		});
	}.bind(this);

	
	try {
		if ( !fs.existsSync(logsDir) ){
			fs.mkdirSync( logsDir );
			addTransport();
		}
		else {
			stats = fs.statSync( logsDir );
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