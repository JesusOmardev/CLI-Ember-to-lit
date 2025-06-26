const fs = require('fs');
const recast = require('recast');
const { visit } = require('ast-types');
const b = recast.types.builders;

function convert(filePath) {
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  const ast = recast.parse(sourceCode);
  let className = 'MyComponent';
  const classMembers = [];

  visit(ast, {
    visitExportDefaultDeclaration(path) {
      const decl = path.node.declaration;

      // Si es una clase nativa de Ember (class X extends Component)
      if (decl.type === 'ClassDeclaration') {
        className = decl.id.name;
        decl.body.body.forEach(member => {
          classMembers.push(member);
        });
      }
      // Si es Component.extend({ ... })
      else if (
        decl.type === 'CallExpression' &&
        decl.callee.object?.name === 'Component' &&
        decl.callee.property?.name === 'extend'
      ) {
        // Extraer nombre de archivo como clase
        className = filePath
          .split(/[\\/]/)
          .pop()
          .replace(/\.js$/, '')
          .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
          .replace(/^(\w)/, (_, c) => c.toUpperCase());

        const obj = decl.arguments[0];
        obj.properties.forEach(prop => {
          if (prop.type === 'ObjectMethod' || prop.value.type === 'FunctionExpression') {
            // Métodos
            classMembers.push(
              b.classMethod(
                'method',
                b.identifier(prop.key.name),
                prop.value.params || prop.params,
                prop.value.body || prop.body
              )
            );
          } else if (prop.type === 'ObjectProperty') {
            // Propiedades simples this.set en init
            if (prop.key.name === 'init') {
              // manejar init si es necesario
            } else {
              const value = prop.value;
              const cp = b.classProperty(b.identifier(prop.key.name), value || null);
              cp.decorators = [b.decorator(b.identifier('property'))];
              classMembers.push(cp);
            }
          }
        });
      }

      return false; // no visitar más dentro
    }
  });

  // Construir la clase LitElement
  const litClass = b.classDeclaration(
    b.identifier(className),
    b.classBody(classMembers),
    b.identifier('LitElement')
  );

  // Importaciones
  const importLit = b.importDeclaration(
    [b.importSpecifier(b.identifier('LitElement')), b.importSpecifier(b.identifier('html'))],
    b.literal('lit')
  );
  const decoratorImport = b.importDeclaration(
    [b.importSpecifier(b.identifier('property'))],
    b.literal('lit/decorators.js')
  );

  // Export
  const exportDefault = b.exportDefaultDeclaration(b.identifier(className));

  // Generar programa
  const program = b.program([importLit, decoratorImport, litClass, exportDefault]);
  const output = recast.print(program).code;
  console.log(output);
}

module.exports = convert;