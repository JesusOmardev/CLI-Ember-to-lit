#  Ember a Lit 

Herramienta de línea de comandos (CLI) para convertir componentes de **Ember.js** a **LitElement**, preservando lógica y propiedades.

---

## ✨ Características

- Convierte `Component.extend({ ... })` a clases `LitElement`
- Transforma métodos y propiedades en miembros válidos para Lit
- Añade decoradores `@property()` automáticamente
- Inserta la plantilla `.hbs` dentro del método `render()` como `html\`\``
- Flujo interactivo: pega directamente el contenido del componente y su plantilla

---

## 🚀 Instalación

```bash
# Clona este repositorio
git clone https://github.com/jesusomardev/ember-to-lit-cli.git
cd ember-to-lit-cli

# Instala dependencias
npm install

# (Opcional) instala globalmente
npm link