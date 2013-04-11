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

logger.init = function(compound){
	if( !compound ){
		throw {
			message: "'compound' parameter should be defined",
			code: 500
		}
	}

	var logsDir = compound.root + '/logs';
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
				this.error('Cannot create logs directory. File with the same name is already exists');
			}
			else {
				// Directory is already exists
				addTransport();
			}
		}
	}
	catch( err ){
		this.error('Cannot create logs directory. ' + err);
	}
};

module.exports = logger;