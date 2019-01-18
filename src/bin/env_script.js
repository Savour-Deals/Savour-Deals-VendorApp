var fs = require('fs');
function readWriteSync() {
let env = process.env.ENV;
if (!process.env.ENV) {
	envfile = 'src/environments/environment.dev.ts';  //SETTING DEFAULT ENV AS DEV
	console.log('development environment');
}else{
	envfile = 'src/environments/environment.prod.ts';
	console.log('production environment');
}
var data = fs.readFileSync(envfile, 'utf-8');
fs.writeFileSync('src/environments/environment.ts', data, 'utf-8');
console.log('readFileSync complete');
}
readWriteSync();