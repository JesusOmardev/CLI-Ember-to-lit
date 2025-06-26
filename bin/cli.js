const { program } = require('commander');
const readline = require('readline');
const convert = require('../lib/convert');

function promptMultiline(promptText) {
  console.log(promptText);
  console.log("(Escribe 'EOF' en una nueva línea para terminar)\n");

  return new Promise((resolve) => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const lines = [];

    rl.on('line', (input) => {
      if (input.trim() === 'EOF') {
        console.log("__________________________________")
        rl.close();
      } else {
        lines.push(input);
      }
    });

    rl.on('close', () => {
      resolve(lines.join('\n'));
    });
  });
}


async function main() {
  console.log(`
  *********************************************
  *                                           *
  *   Bienvenido a ember-to-lit CLI v1.0.0    *
  *   Convierte componentes de Ember.js       *
  *   al moderno LitElement.                  *
  *                                           *
  *********************************************
  `);

  const jsCode = await promptMultiline("-> Pega el contenido del componente JS:");
  
  const hbsTemplate = await promptMultiline("-> Pega la plantilla HBS asociada:");

  console.log("\n_____________________Convirtiendo componente_____________________\n");

  try {
    const output = convert(jsCode, hbsTemplate);
    console.log("\n✅ Resultado:\n");
    console.log(output);
  } catch (error) {
    console.error("❌ Error durante la conversión:", error.message);
  }
}


program
  .name('ember-to-lit')
  .description('Convierte componentes Ember.js (interactivo)')
  .action(main);

program.parse();
