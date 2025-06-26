const { program } = require('commander');
const path = require('path');
const convert = require('../lib/convert');

program
  .name('ember-to-lit')
  .description('Convierte lógica de componentes Ember.js a LitElement')
  .argument('<file>', 'Ruta del componente Ember.js')
  .option('-o, --output <dir>', 'Directorio de salida', './lit-output')
  .action((file, options) => {
    const fullPath = path.resolve(file);
    convert(fullPath, options.output);
  });

program.parse();
   