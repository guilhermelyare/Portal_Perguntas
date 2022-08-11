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
app.get("/", (req,res) => {
    //O .findAll() é responsável por selecionar dados da tabela é equivalente ao SELECT ALL FROM do MySQL
    //O raw é uma pesquisa crua que vai trazer apenas os dados e não todas as informações da tabela
    //O order serve para dizer como vai ser a ordenação dos dados que vão sendo selecionados 
    //Dentro do then está sendo criado uma variavel perguntas tem uma função que renderiza a pagina index.ejs e passa os dados atraves da vriavel perguntas
    Pergunta.findAll({ raw:true, order: [
        ['id','DESC']//DESC = decescente e ASC = crescente
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas,
        });
    })
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    //Para salvar um dado em uma tabela devo chamar o model que representa essa tabela (Pergunta) e usar o .creat() que é equivalente ao INSERT INTO do mysql
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");//redirecionado para a pagina inicial
    })//o .then serve para fazer algo quando a pergunta for salva no banco de dados
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

app.listen(8080,()=>{console.log("App rodando na porta 8080!");});