// Importação base do Express
const express = require("express");
const app = express();

// Importação do body-parser
const bodyParser = require("body-parser")
// Armazenamento dos dados do usuário em sessão
const session = require("express-session");
// Bcrypt para encriptar as senhas dos usuários
const bcrypt = require("bcrypt");
// Importando as Entidades
const dataBase = require('./models');

// Configuração da Conexão com o Banco de Dados (Remova se não estiver usando mais o connection direto)
dataBase.sequelize.authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de Dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    });

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');

// Para a aplicação usar arquivos estaticos
app.use(express.static('public'));

// Linkar o bodypasser, responsavel por traduzir os dados enviados pelo formulario em uma estrutura JS que pode ser usada no backend
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware para passar a sessão para todas as views
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    next();
});

// Middleware de acesso
function authMiddleware(req, res, next) {
    // Verificando se o usuário está autenticado
    if (!req.session.usuario) {
        res.redirect("/login");
    } else {
        next();
    }
}

// Rotas
app.get("/", authMiddleware, (req, res) => {
    res.redirect("/dashboard");
});

app.get("/dashboard", authMiddleware, async (req, res) => {
    const pagina = req.query.pagina || 1; // Página atual (padrão: 1)
    const porPagina = 5; // Quantidade de perguntas por página
    const offset = (pagina - 1) * porPagina; // Offset para consulta
    const filtroTema = req.query.tema; // Filtro de tema

    try {
        let consulta = {
            raw: true,
            order: [['id', 'ASC']], // Ordenação das perguntas
            limit: porPagina,
            offset: offset
        };

        if (filtroTema) {
            consulta.where = { tema: filtroTema };
        }

        const { count, rows: perguntas } = await dataBase.Pergunta.findAndCountAll(consulta);

        const totalPaginas = Math.ceil(count / porPagina);

        res.render("index", {
            perguntas: perguntas,
            totalPaginas: totalPaginas,
            paginaAtual: pagina,
            filtroTema: filtroTema, // Passando a variável filtroTema para o template EJS
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Erro interno do servidor");
    }
});

app.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

app.post("/cadastrar", async (req, res) => {
    const { nome, email, senha, confirmaSenha } = req.body;

    try {
        if (senha != confirmaSenha) {
            return res.render("cadastro", { errorMessage: "As senhas não coincidem. Tente novamente" });
        }

        const usuarioExistente = await dataBase.Usuario.findOne({ where: { email: email } });

        if (usuarioExistente) {
            // Se o usuário já existir, redirecione para a página de cadastro com uma mensagem de erro
            return res.render("cadastro", { errorMessage: "Já existe um usuário com esse email. Tente outro." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        await dataBase.Usuario.create({
            nome: nome,
            email: email,
            senha: hashedPassword
        });

        res.redirect("/login");
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao cadastrar usuário.");
    }
});

app.get("/logout", authMiddleware, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erro ao fazer logout.");
        }
        res.redirect("/login");
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await dataBase.Usuario.findOne({ where: { email: email } });

        if (!usuario) {
            res.status(400).send("Email ou senha incorretos.");
            return;
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            res.status(400).send("Email ou senha incorretos.");
            return;
        }

        // Armazene o usuário na sessão
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).send("Erro ao fazer login.");
    }
});

app.get("/perguntar", authMiddleware, (req, res) => {
    if (!req.session.usuario) {
        res.redirect("/login");
        return;
    }
    res.render("perguntar");
});

app.post("/salvarpergunta", authMiddleware, (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const tema = req.body.tema;

    // Salvar a pergunta no banco de dados
    dataBase.Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        tema: tema,
        usuarioId: req.session.usuario.id // Atribuir o ID do usuário logado
    }).then(() => {
        res.redirect("/dashboard"); // Redirecionado para a página inicial
    }).catch((error) => {
        console.error("Erro ao salvar pergunta:", error);
        res.status(500).send("Erro ao salvar a pergunta.");
    });
});

app.get("/pergunta/:id", authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;

        // Buscando a pergunta e incluindo o nome do usuário que a fez
        const pergunta = await dataBase.Pergunta.findOne({
            where: { id: id },
            include: [{
                model: dataBase.Usuario,
                as: 'usuario',
                attributes: ['nome'] // Inclui apenas o nome do usuário
            }]
        });

        if (!pergunta) {
            return res.redirect("/");
        }

        // Buscando as respostas da pergunta e incluindo o nome do usuário que respondeu
        const respostas = await dataBase.Resposta.findAll({
            where: { perguntaId: pergunta.id },
            include: [{
                model: dataBase.Usuario,
                as: 'usuario',
                attributes: ['nome'] // Inclui apenas o nome do usuário
            }],
            order: [['id', 'DESC']]
        });

        res.render("pergunta", {
            pergunta: pergunta,
            respostas: respostas
        });
    } catch (error) {
        console.error("Erro ao carregar a pergunta:", error);
        res.status(500).send("Erro interno do servidor.");
    }
});



app.post("/responder", authMiddleware, (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    
    // Verifica se o usuário está autenticado e pega o ID do usuário a partir da sessão
    var usuarioId = req.session.usuario.id;

    // Cria a resposta associando-a ao usuário autenticado
    dataBase.Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
        usuarioId: usuarioId // Inclui o ID do usuário que está respondendo
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    }).catch((error) => {
        console.error("Erro ao criar resposta:", error);
        res.status(500).send("Erro ao salvar a resposta.");
    });
});



app.delete("/pergunta/:id", authMiddleware, (req, res) => {
    var id = req.params.id;

    dataBase.Pergunta.destroy({
        where: { id: id }
    }).then(() => {
        res.status(204).send(); // 204 No Content para indicar sucesso sem conteúdo
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    });
});

// Sincroniza os modelos e inicia o servidor
dataBase.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });
});
