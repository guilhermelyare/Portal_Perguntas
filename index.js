const express = require("express");
const app = express();
const bodyParser = require("body-parser")// importando o body passer
const connection = require("./database/database")// conexao com o banco de dados
const Pergunta = require("./database/Pergunta")// Importando o model pergunta para a criação da tabela no Banco de dados
const Resposta = require("./database/Resposta")

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de Dados!")
    })
    .catch((msgErro)=>{
        console.log(msgErro)
    })

//Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');

//Para a aplicação usar arquivos estaticos
app.use(express.static('public'));

//Linkar o bodypasser, responsavel por traduzir os dados enviados pelo formulario em uma estrutura JS que pode ser usada no backend
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", async (req, res) => {
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

        const { count, rows: perguntas } = await Pergunta.findAndCountAll(consulta);

        const totalPaginas = Math.ceil(count / porPagina);

        res.render("index", {
            perguntas: perguntas,
            totalPaginas: totalPaginas,
            paginaAtual: pagina,
            filtroTema: filtroTema // Passando a variável filtroTema para o template EJS
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Erro interno do servidor");
    }
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var tema = req.body.tema;

    // Salvar a pergunta no banco de dados
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        tema: tema
    }).then(() => {
        res.redirect("/"); // Redirecionado para a página inicial
    });
});


app.get("/pergunta/:id", (req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if(pergunta != undefined){//Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{//Pergunta não encontrada
            res.redirect("/");
        }
    })
});

app.post("/responder", (req,res)=> {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId);
    })
})

app.delete("/pergunta/:id", (req, res) => {
    var id = req.params.id;

    Pergunta.destroy({
        where: { id: id }
    }).then(() => {
        res.status(204).send(); // 204 No Content para indicar sucesso sem conteúdo
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor" });
    });
});

app.listen(8080,()=>{console.log("App rodando na porta 8080!");});