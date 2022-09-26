const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const app = express();

const expenses = require('./expenses.ff');
const pgp = require('pg-promise')();

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:pg123@localhost:5432/expenses_app';

const config = {
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
const expenses_instance = expenses(db);


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
    secret: "This is my long String that is used for session",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash());

app.get('/',  async function (req, res) {
   
    res.render('index', {
       
    })
})

app.post('/register', async function (req,res){
    let user = req.body.firstname

    if(user != null){
        await expenses_instance.storedNames(user)
    }

    var username = await expenses_instance.greet(user)
    // console.log(username)
   
    res.render('category',{
        uname: username.firstname
    })

})

app.post('/category/:username', async function (req,res){
    let expenses1 = req.body.expenses

    let username = req.params.username
// console.log(available_days)

   if(expenses !== null){
    await expenses_instance.expenses_data(username, expenses1)
   }

   
    res.render('category',{
        uname: username
    })
})



const PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});