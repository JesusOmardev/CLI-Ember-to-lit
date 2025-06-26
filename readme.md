#  Ember a Lit 

Herramienta de línea de comandos (CLI) para convertir componentes de **Ember.js** a **LitElement**, preservando lógica y propiedades.

---

## Características

- Convierte `Component.extend({ ... })` a clases `LitElement`
- Extrae propiedades definidas en `this.set()` como `@property()`
- Transforma métodos en miembros de clase
- Genera una clase exportada por defecto
- Formatea la salida con `recast`
- CLI con mensajes estéticos (`ora`, `chalk`)

---

## Instalación

```bash
# Clona este repositorio
git clone https://github.com/jesusomardev/ember-to-lit-cli.git
cd ember-to-lit-cli

# Instala dependencias
npm install

# (Opcional) Instala globalmente
npm link
