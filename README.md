# js-fetch-api-produtos

OBS:

O atributo data-* é uma convenção oficial do HTML5 que permite aos desenvolvedores 
criar atributos personalizados e seguros para armazenar dados em elementos HTML.
      
A sintaxe é sempre "data-nome", onde "nome" pode ser qualquer identificador válido.

Os valores retornados por dataset são sempre strings. Use parseInt() ou parseFloat() para convertê-los para os correspondentes numéricos.

Exemplo válido:
```html
<button id="editar" data-id="123" data-nome="teclado" data-preco="199.99">Editar</button>
```
No JavaScript, o acesso a esses atributos é realizado da seguinte forma:

```JS
const elemento = document.getElementById("editar");
const id = parseInt(elemento.dataset.id);         // "123"
const nome = elemento.dataset.nome;               // "teclado"
const preco = parseFloat(elemento.dataset.preco); // "199.99"
```