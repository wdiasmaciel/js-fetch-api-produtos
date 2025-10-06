document.addEventListener('DOMContentLoaded', () => {
    const url = 'bd.json';

    const formularioDeProduto = document.getElementById('formulario-de-produto');
    const campoIdDoProduto = document.getElementById('produto-id');
    const botaoEnviar = document.getElementById('botao-enviar');
    const listaDeProdutos = document.getElementById('lista-de-produtos');

    let produtos = [];

    const buscarProdutos = async () => {
        try {
            const response = await fetch(url);

            if (!response.ok) 
                throw new Error('Não foi possível carregar os produtos.');

            const dados = await response.json();
            
            produtos = dados.produtos;

            apresentarTabela();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            listaDeProdutos.innerHTML = `<tr>
                                           <td colspan="4">
                                             Erro ao carregar dados. Tente novamente mais tarde.
                                           </td>
                                         </tr>`;
        }
    };

    const apresentarTabela = () => {
        listaDeProdutos.innerHTML = '';

        if (produtos.length === 0) {
            listaDeProdutos.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        produtos.forEach(produto => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>${formatarMoeda(produto.preco)}</td>
                <td class="campo-dos-botoes-de-acoes">
                    <button class="botao-de-acao botao-editar"  data-id="${produto.id}">✏️ Editar</button>
                    <button class="botao-de-acao botao-excluir" data-id="${produto.id}">🗑️ Excluir</button>
                </td>
            `;

            listaDeProdutos.appendChild(linha);
        });
    };

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    formularioDeProduto.addEventListener('submit', (event) => {
        event.preventDefault();

        const id = parseInt(campoIdDoProduto.value);
        const nome = document.getElementById('nome').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const preco = parseFloat(document.getElementById('preco').value);

        if (id) {
            const index = produtos.findIndex(p => p.id == id);
            if (index !== -1) {
                produtos[index] = { id: id, nome: nome, quantidade: quantidade, preco: preco };
            }
        } else {
            const novoProduto = {
                id: Date.now(),
                nome: nome,
                quantidade: quantidade,
                preco: preco,
            };
            produtos.push(novoProduto);
        }

        limparFormulario();
        apresentarTabela();
    });

    listaDeProdutos.addEventListener('click', (event) => {
        const alvo = event.target;
        const id = parseInt(alvo.dataset.id);

        if (alvo.classList.contains('botao-editar')) {
            const produtoParaEditar = produtos.find(p => p.id == id);
            if (produtoParaEditar) {
                campoIdDoProduto.value = produtoParaEditar.id;
                document.getElementById('nome').value = produtoParaEditar.nome;
                document.getElementById('quantidade').value = produtoParaEditar.quantidade;
                document.getElementById('preco').value = produtoParaEditar.preco;
                botaoEnviar.textContent = 'Atualizar Produto';
                window.scrollTo(0, 0);
            }
        } else if (alvo.classList.contains('botao-excluir')) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                produtos = produtos.filter(p => parseInt(p.id) != id);
                apresentarTabela();
            }
        }
    });

    const limparFormulario = () => {
        formularioDeProduto.reset();
        campoIdDoProduto.value = '';
        botaoEnviar.textContent = 'Adicionar Produto';
    }

    buscarProdutos();
});