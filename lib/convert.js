const recast = require('recast');
const { visit } = require('ast-types');
const b = recast.types.builders;

function convert(emberCode, hbsTemplate = '') {
  const ast = recast.parse(emberCode);
  let className = 'MyComponent';
  const classMembers = [];

  visit(ast, {
    visitExportDefaultDeclaration(path) {
      const decl = path.node.declaration;

      // Component.extend({ ... })
      if (
        decl.type === 'CallExpression' &&
        decl.callee.object?.name === 'Component' &&
        decl.callee.property?.name === 'extend'
      ) {
        // Nombre de clase desde archivo o fallback
        className = 'ConvertedComponent';

        const obj = decl.arguments[0];
        obj.properties.forEach((prop) => {
          if (prop.type === 'ObjectMethod' || prop.value?.type === 'FunctionExpression') {
            // Métodos
            classMembers.push(
              b.classMethod(
                'method',
                b.identifier(prop.key.name),
                prop.value?.params || prop.params,
                prop.value?.body || prop.body
              )
            );
          } else if (prop.type === 'ObjectProperty') {
            // Propiedades decoradas
            const value = prop.value;
            const cp = b.classProperty(b.identifier(prop.key.name), value || null);
            cp.decorators = [b.decorator(b.identifier('property'))];
            classMembers.push(cp);
          }
        });
      }

      return false;
    }
  });

  // Añadir método render() con plantilla hbs
  const sanitized = hbsTemplate.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const renderMethod = b.classMethod(
    'method',
    b.identifier('render'),
    [],
    b.blockStatement([
      b.returnStatement(
        b.taggedTemplateExpression(
          b.identifier('html'),
          b.templateLiteral(
            [b.templateElement({ raw: sanitized, cooked: sanitized }, true)],
            []
          )
        )
      )
    ])
  );

  classMembers.push(renderMethod);

  // Construcción de clase LitElement
  const classDecl = b.classDeclaration(
    b.identifier(className),
    b.classBody(classMembers),
    b.identifier('LitElement')
  );

  // Importaciones
  const importLit = b.importDeclaration(
    [b.importSpecifier(b.identifier('LitElement')), b.importSpecifier(b.identifier('html'))],
    b.literal('lit')
  );
  const importDecorator = b.importDeclaration(
    [b.importSpecifier(b.identifier('property'))],
    b.literal('lit/decorators.js')
  );

  // Exportación
  const exportStmt = b.exportDefaultDeclaration(b.identifier(className));

  // Programa final
  const program = b.program([importLit, importDecorator, classDecl, exportStmt]);
  return recast.print(program).code;
}

module.exports = convert;
