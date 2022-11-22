import fs from 'fs';
// Parse rfsb config file
  const config = JSON.parse(fs.readFileSync('rfsb.config.json', { encoding: 'utf8' }));
  const { name, componentEntryPoint, ...configRest } = config;
  for(const aConfig of Object.values(configRest)) {
    console.log(aConfig);
    // Build component here
    // Find a way to get ComponentName from cli option
  }
  console.log(config);