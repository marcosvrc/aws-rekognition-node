
import express from "express";
import bodyParser from "body-parser"
import router from './routers/router'


const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', router);

app.listen(PORT, ()=> {
  console.log(`Servidor rodando em ${HOSTNAME}:${PORT}`);
})