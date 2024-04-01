const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// Função para adicionar uma resposta ao banco de dados
async function adicionarResposta(corpo, perguntaId) {
    try {
        await Resposta.create({ corpo, perguntaId });
        console.log("Resposta adicionada com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar resposta:", error);
    }
}

// Função para adicionar uma pergunta ao banco de dados
async function adicionarPergunta(titulo, descricao, tema) {
    try {
        await Pergunta.create({ titulo, descricao, tema });
        console.log("Pergunta adicionada com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar pergunta:", error);
    }
}

// Populando o banco de dados com 20 perguntas
(async () => {
    const perguntas = [
        { titulo: "Como declarar uma variável em JavaScript?", descricao: "Gostaria de entender como declarar variáveis em JavaScript.", tema: 1 },
        { titulo: "Por que meu loop for não está funcionando corretamente?", descricao: "Estou tendo problemas com um loop for em meu código JavaScript.", tema: 2 },
        { titulo: "Quais são os princípios do MVC?", descricao: "Estou tentando entender os princípios por trás do padrão MVC.", tema: 3 },
        { titulo: "Qual é a diferença entre '==' e '===' em JavaScript?", descricao: "Estou confuso sobre as diferenças entre esses operadores de comparação.", tema: 1 },
        { titulo: "Como evitar vazamentos de memória em JavaScript?", descricao: "Gostaria de saber como evitar vazamentos de memória em minhas aplicações JavaScript.", tema: 4 },
        { titulo: "Como criar uma classe em Python?", descricao: "Quero aprender a criar classes em Python.", tema: 1 },
        { titulo: "Meu código está gerando um erro de sintaxe, o que pode ser?", descricao: "Estou enfrentando problemas com um erro de sintaxe em meu código.", tema: 2 },
        { titulo: "Quais são os padrões de design mais utilizados em Python?", descricao: "Estou interessado em aprender sobre os padrões de design comumente usados em Python.", tema: 3 },
        { titulo: "Qual é a maneira mais eficiente de ordenar uma lista em Python?", descricao: "Estou buscando a maneira mais eficiente de ordenar listas em Python.", tema: 4 },
        { titulo: "Como usar a função map() em JavaScript?", descricao: "Gostaria de entender como a função map() funciona e como usá-la em JavaScript.", tema: 1 },
        { titulo: "Estou enfrentando problemas de desempenho em meu aplicativo, como posso melhorá-lo?", descricao: "Gostaria de algumas dicas sobre como melhorar o desempenho do meu aplicativo.", tema: 4 },
        { titulo: "O que são decorators em Python?", descricao: "Estou confuso sobre o conceito de decorators em Python.", tema: 3 },
        { titulo: "Como lidar com exceções em JavaScript?", descricao: "Gostaria de saber como lidar com exceções em JavaScript de maneira eficaz.", tema: 1 },
        { titulo: "Meu código está retornando resultados incorretos, como posso depurá-lo?", descricao: "Estou enfrentando problemas com a lógica do meu código e gostaria de depurá-lo.", tema: 2 },
        { titulo: "Quais são as melhores práticas para testar código em JavaScript?", descricao: "Estou buscando as melhores práticas para escrever testes em JavaScript.", tema: 4 },
        { titulo: "Como implementar autenticação em uma aplicação web?", descricao: "Estou interessado em aprender como adicionar autenticação a uma aplicação web.", tema: 3 },
        { titulo: "Qual é a diferença entre funções síncronas e assíncronas em JavaScript?", descricao: "Estou confuso sobre a diferença entre esses dois tipos de funções em JavaScript.", tema: 1 },
        { titulo: "Estou tendo dificuldades com o conceito de escopo em JavaScript, você pode me ajudar?", descricao: "Gostaria de uma explicação clara sobre o escopo em JavaScript.", tema: 1 },
        { titulo: "Como organizar um projeto de grande escala em Python?", descricao: "Estou trabalhando em um projeto grande em Python e gostaria de saber como organizá-lo melhor.", tema: 4 },
        { titulo: "O que são generators em JavaScript e como usá-los?", descricao: "Estou interessado em aprender sobre generators em JavaScript.", tema: 1 },
        { titulo: "Quais são os principais antipadrões de design a serem evitados?", descricao: "Gostaria de saber quais são os antipadrões de design mais comuns e como evitá-los.", tema: 3 },
        { titulo: "Como posso evitar loops infinitos em JavaScript?", descricao: "Estou enfrentando problemas com loops infinitos em meu código JavaScript.", tema: 2 },
        { titulo: "Quais são as vantagens e desvantagens da programação orientada a objetos?", descricao: "Estou interessado em aprender sobre os prós e contras da programação orientada a objetos.", tema: 1 },
        { titulo: "Meu aplicativo está enfrentando problemas de segurança, como posso fortalecê-lo?", descricao: "Gostaria de saber como aumentar a segurança do meu aplicativo.", tema: 3 },
        { titulo: "Como usar a biblioteca React para criar interfaces de usuário?", descricao: "Gostaria de aprender como usar React para criar interfaces de usuário interativas.", tema: 1 },
        { titulo: "Estou tendo dificuldades para entender as promessas em JavaScript, você pode me ajudar?", descricao: "Gostaria de uma explicação detalhada sobre promessas em JavaScript.", tema: 1 },
        { titulo: "Quais são as melhores práticas para organizar o código CSS em um projeto web?", descricao: "Estou buscando maneiras eficientes de organizar meu código CSS.", tema: 4 },
        { titulo: "O que é o paradigma de programação funcional e quando devo usá-lo?", descricao: "Estou interessado em aprender sobre o paradigma de programação funcional.", tema: 1 },
        { titulo: "Meu código está sofrendo com problemas de performance, como posso otimizá-lo?", descricao: "Gostaria de dicas sobre como melhorar a performance do meu código.", tema: 4 },
        { titulo: "Quais são as principais características da linguagem de programação Python?", descricao: "Estou interessado em aprender mais sobre as características da linguagem Python.", tema: 1 },
        { titulo: "Estou tentando entender o conceito de herança em programação orientada a objetos, pode me explicar?", descricao: "Gostaria de uma explicação clara sobre o conceito de herança em programação orientada a objetos.", tema: 1 },
        { titulo: "Como posso fazer requisições HTTP em JavaScript?", descricao: "Gostaria de aprender como fazer requisições HTTP em JavaScript.", tema: 1 },
        { titulo: "Quais são as vantagens de usar uma arquitetura de microserviços em um projeto?", descricao: "Estou interessado em aprender sobre as vantagens de usar uma arquitetura de microserviços.", tema: 3 },
        { titulo: "Meu código está retornando 'undefined', o que posso fazer para corrigir isso?", descricao: "Estou enfrentando problemas com valores 'undefined' em meu código JavaScript.", tema: 2 },
        { titulo: "Quais são os princípios básicos da programação orientada a objetos?", descricao: "Gostaria de entender os princípios fundamentais da programação orientada a objetos.", tema: 1 },
        { titulo: "Como posso implementar um sistema de cache em uma aplicação web?", descricao: "Estou buscando maneiras de implementar um sistema de cache para melhorar a performance da minha aplicação web.", tema: 3 },
        { titulo: "Quais são as melhores práticas para lidar com datas em JavaScript?", descricao: "Estou buscando maneiras eficientes de lidar com datas em JavaScript.", tema: 4 },
        { titulo: "O que é o modelo de caixa flexível (Flexbox) e como usá-lo?", descricao: "Gostaria de aprender sobre o modelo de caixa flexível e como usá-lo para criar layouts responsivos.", tema: 4 },
        { titulo: "Qual é a diferença entre uma função declarativa e uma expressão de função em JavaScript?", descricao: "Estou confuso sobre a diferença entre esses dois tipos de funções em JavaScript.", tema: 1 },
        { titulo: "Estou tendo dificuldades com problemas de concorrência em meu aplicativo, como posso lidar com isso?", descricao: "Gostaria de dicas sobre como lidar com problemas de concorrência em meu aplicativo.", tema: 3 },
        { titulo: "Como posso implementar um sistema de autenticação baseado em tokens JWT?", descricao: "Estou interessado em aprender como implementar um sistema de autenticação baseado em tokens JWT.", tema: 3 },
        { titulo: "Quais são as melhores práticas para escrever código limpo e legível?", descricao: "Estou buscando maneiras de melhorar a legibilidade e a manutenibilidade do meu código.", tema: 4 },
        { titulo: "Como posso usar o MongoDB para armazenar e recuperar dados em uma aplicação web?", descricao: "Gostaria de aprender como usar o MongoDB como banco de dados em uma aplicação web.", tema: 3 },
        { titulo: "Quais são as diferenças entre as versões ES5, ES6 e ES7 do JavaScript?", descricao: "Estou confuso sobre as diferenças entre as diferentes versões do JavaScript.", tema: 1 },
        { titulo: "Estou tendo dificuldades com problemas de CORS em minha aplicação web, como posso resolver isso?", descricao: "Gostaria de saber como lidar com problemas de CORS em minha aplicação web.", tema: 3 },
        { titulo: "Como posso implementar uma fila de mensagens em uma aplicação web?", descricao: "Estou buscando maneiras de implementar uma fila de mensagens para processamento assíncrono em minha aplicação web.", tema: 3 },
        { titulo: "Quais são as vantagens de usar TypeScript em vez de JavaScript puro?", descricao: "Estou interessado em aprender sobre as vantagens de usar TypeScript para o desenvolvimento de aplicações web.", tema: 1 },
        { titulo: "Estou tentando entender a diferença entre 'null' e 'undefined' em JavaScript, pode me explicar?", descricao: "Gostaria de uma explicação clara sobre a diferença entre 'null' e 'undefined' em JavaScript.", tema: 1 },
        { titulo: "Como posso implementar uma funcionalidade de pesquisa em uma aplicação web?", descricao: "Estou buscando maneiras de implementar uma funcionalidade de pesquisa eficiente em minha aplicação web.", tema: 3 },
        { titulo: "Quais são as vantagens e desvantagens de usar um banco de dados relacional em comparação com um banco de dados NoSQL?", descricao: "Estou interessado em aprender sobre as diferenças entre bancos de dados relacionais e NoSQL.", tema: 3 },
        { titulo: "Meu aplicativo está sofrendo com problemas de escalabilidade, como posso lidar com isso?", descricao: "Gostaria de dicas sobre como tornar meu aplicativo mais escalável.", tema: 3 },
        { titulo: "Como posso criar e manipular elementos HTML dinamicamente usando JavaScript?", descricao: "Estou buscando maneiras de criar e manipular elementos HTML dinamicamente em JavaScript.", tema: 1 },
        { titulo: "Quais são as melhores práticas para garantir a segurança de uma aplicação web?", descricao: "Estou buscando maneiras de aumentar a segurança de minha aplicação web.", tema: 3 },
        { titulo: "O que é o protocolo HTTP e como funciona?", descricao: "Gostaria de aprender sobre o protocolo HTTP e como ele é usado na web.", tema: 3 },
        { titulo: "Como posso implementar um sistema de roteamento em uma aplicação web usando Node.js?", descricao: "Estou buscando maneiras de implementar um sistema de roteamento eficiente em minha aplicação web.", tema: 3 },
        { titulo: "Quais são as vantagens de usar a programação assíncrona em JavaScript?", descricao: "Estou interessado em aprender sobre as vantagens da programação assíncrona em JavaScript.", tema: 1 },
        { titulo: "Estou tentando entender como funcionam as closures em JavaScript, pode me explicar?", descricao: "Gostaria de uma explicação clara sobre o conceito de closures em JavaScript.", tema: 1 },
        { titulo: "Como posso implementar um sistema de cache de memória em uma aplicação web?", descricao: "Estou buscando maneiras de implementar um sistema de cache de memória para melhorar o desempenho de minha aplicação web.", tema: 3 },
        { titulo: "Quais são as principais diferenças entre Java e JavaScript?", descricao: "Estou confuso sobre as diferenças entre Java e JavaScript.", tema: 1 },
        { titulo: "Estou tendo dificuldades com problemas de otimização de banco de dados, como posso melhorar o desempenho das consultas?", descricao: "Gostaria de dicas sobre como otimizar consultas em meu banco de dados.", tema: 3 },
        { titulo: "Como posso implementar um sistema de autenticação usando OAuth 2.0?", descricao: "Estou interessado em aprender como implementar um sistema de autenticação usando OAuth 2.0 em minha aplicação web.", tema: 3 }
    ]
    
    const respostas = [
        { corpo: "Para declarar uma variável em JavaScript, você pode usar 'var', 'let' ou 'const'.", perguntaId: 2 },
        { corpo: "Em JavaScript, '==' compara os valores das variáveis, enquanto '===' compara os valores e os tipos de dados.", perguntaId: 2 },
        { corpo: "A função map() em JavaScript é usada para aplicar uma função a cada elemento de uma matriz e retornar uma nova matriz com os resultados.", perguntaId: 2 },
        { corpo: "Para lidar com exceções em JavaScript, use blocos try...catch para capturar e lidar com erros.", perguntaId: 2 },
        { corpo: "As melhores práticas para testar código em JavaScript incluem escrever testes unitários e de integração, usar ferramentas de teste automatizado e adotar uma abordagem de desenvolvimento orientada por testes.", perguntaId: 2 },
        { corpo: "Funções síncronas bloqueiam a execução do código até que a operação seja concluída, enquanto funções assíncronas permitem que o código continue executando enquanto espera que a operação seja concluída.", perguntaId: 2 },
        { corpo: "O escopo em JavaScript refere-se ao contexto em que as variáveis e funções estão acessíveis.", perguntaId: 2 },
        { corpo: "Os generators em JavaScript são funções especiais que podem ser pausadas e retomadas em diferentes momentos, permitindo a criação de sequências de valores sob demanda.", perguntaId: 2 },
        { corpo: "Verifique se você está inicializando corretamente as variáveis em seu loop for.", perguntaId: 2 },
        { corpo: "Certifique-se de que não há erros de digitação ou caracteres especiais incorretos em seu código.", perguntaId: 2 },
        { corpo: "Em Python, '==' compara os valores das variáveis, enquanto '===' compara os valores e os tipos de dados.", perguntaId: 2 },
        { corpo: "Os padrões de design mais utilizados em Python incluem Singleton, Factory, Observer e Strategy.", perguntaId: 2 },
        { corpo: "Você pode usar o método sort() para ordenar uma lista em Python.", perguntaId: 2 },
        { corpo: "Para criar uma classe em Python, você pode usar a palavra-chave 'class' seguida pelo nome da classe e uma definição de corpo.", perguntaId: 2 },
        { corpo: "Para lidar com exceções em Python, use blocos try...except para capturar e lidar com erros.", perguntaId: 2 },
        { corpo: "As melhores práticas para testar código em Python incluem escrever testes unitários e de integração, usar ferramentas de teste automatizado e adotar uma abordagem de desenvolvimento orientada por testes.", perguntaId: 2 },
        { corpo: "Use a declaração 'import' para importar módulos e pacotes em seu código Python.", perguntaId: 2 },
        { corpo: "Python é uma linguagem de programação de alto nível, interpretada, orientada a objetos e com tipagem dinâmica.", perguntaId: 2 },
        { corpo: "Para lidar com exceções em Python, você pode criar suas próprias exceções personalizadas herdando da classe Exception.", perguntaId: 2 },
        { corpo: "Os decoradores em Python são funções que envolvem outras funções ou métodos para adicionar funcionalidades extras a eles.", perguntaId: 2 },
        { corpo: "Para iterar sobre os elementos de uma lista em Python, você pode usar um loop 'for' ou a função 'map()'.", perguntaId: 2 },
    ];
    
    
    for (const pergunta of perguntas) {
        await adicionarPergunta(pergunta.titulo, pergunta.descricao, pergunta.tema);
    }

    for (const resposta of respostas) {
        await adicionarResposta(resposta.corpo, resposta.perguntaId);
    }

    // Fechar conexão com o banco de dados após adicionar todas as respostas
    await connection.close();
})();