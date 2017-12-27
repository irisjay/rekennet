var debug = true;

var hostname = process .env .C9_HOSTNAME;
var port = process .env .PORT;

var dist_webapp_path = require ('path') .join (require ('get-root-path') .rootPath, '/dist/build/hci');


require ('koa-qs') (new (require ('koa')) ())
	.use (require ('koa-compress') ())
	.use (require ('koa-cors') ())
	.use (function (ctx, next) {
		return	next ()
					.catch (function (err) {
						console .error (err)
						
						ctx .type = 'application/json'
						ctx .status = /*err .code || */500
						//ctx .message = err .message || 'Internal Server Error'
						ctx .body =	{
										error:	err .message
									}
						if (debug)
							ctx .body .stack = err .stack;
					});
	})
	.use (require ('koa-morgan') ('combined'))
	.use (require ('koa-bodyparser') ())
	.use (require ('koa-json') ())
	.use (require ('koa-static') (dist_webapp_path))
	
	.listen (8080);

console .log ('Listening at ' + hostname + ':' + port + '...')
