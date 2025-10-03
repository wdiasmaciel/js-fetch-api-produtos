document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'products.json';
    const formularioProduto = document.getElementById('formulario-produto');
    const listaProdutos = document.getElementById('lista-produtos');
    const campoIdProduto = document.getElementById('produto-id');
    const botaoEnviar = document.getElementById('botao-enviar');
    
    let produtos = [];

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const buscarProdutos = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
            produtos = await response.json();
            renderizarTabela();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            listaProdutos.innerHTML = `<tr><td colspan="4">Erro ao carregar dados. Tente novamente mais tarde.</td></tr>`;
        }
    };

    const renderizarTabela = () => {
        listaProdutos.innerHTML = '';
        if (produtos.length === 0) {
            listaProdutos.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        produtos.forEach(produto => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>${formatarMoeda(produto.preco)}</td>
                <td>
                    <button class="btn-acao btn-editar" data-id="${produto.id}">✏️ Editar</button>
                    <button class="btn-acao btn-excluir" data-id="${produto.id}">🗑️ Excluir</button>
                </td>
            `;
            listaProdutos.appendChild(linha);
        });
    };

    formularioProduto.addEventListener('submit', (event) => {
        event.preventDefault();

        const id = campoIdProduto.value;
        const nome = document.getElementById('nome').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const preco = parseFloat(document.getElementById('preco').value);

        if (id) {
            const index = produtos.findIndex(p => p.id == id);
            if (index !== -1) {
                produtos[index] = { ...produtos[index], nome: nome, quantidade: quantidade, preco: preco };
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
        
        resetarFormulario();
        renderizarTabela();
    });

    listaProdutos.addEventListener('click', (event) => {
        const alvo = event.target;
        const id = alvo.dataset.id;

        if (alvo.classList.contains('btn-editar')) {
            const produtoParaEditar = produtos.find(p => p.id == id);
            if (produtoParaEditar) {
                campoIdProduto.value = produtoParaEditar.id;
                document.getElementById('nome').value = produtoParaEditar.nome;
                document.getElementById('quantidade').value = produtoParaEditar.quantidade;
                document.getElementById('preco').value = produtoParaEditar.preco;
                botaoEnviar.textContent = 'Atualizar Produto';
                window.scrollTo(0, 0);
            }
        } else if (alvo.classList.contains('btn-excluir')) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                produtos = produtos.filter(p => p.id != id);
                renderizarTabela();
            }
        }
    });

    const resetarFormulario = () => {
        formularioProduto.reset();
        campoIdProduto.value = '';
        botaoEnviar.textContent = 'Adicionar Produto';
    }

    buscarProdutos();
});