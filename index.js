const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const app = express();

const expenses = require('./expenses.ff.js');
const pgp = require('pg-promise')();

const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

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

app.get('/', async function (req, res) {

    res.render('index', {

    })
})

app.post('/register', async function (req, res) {
    let user = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
//    console.log(email)
        // let   results
    //  if(email){
  let results = await expenses_instance.duplicate(email)

    //  }
    //  console.log(results.length)
            // let results = await expenses_instance.duplicate(email)

    
//   console.log(results.length + "dssdsdsdsdsdsds")
if(results.length === 0){
    let password = uid();
     req.flash('sukuna', "Hi, here is you code to login__" + password)
    await expenses_instance.storedNames(user, lastname, email, password)

}else {req.flash('sukuna', 'Username already exists');}

            // req.flash('sukuna', await expenses_instance.storedNames(user, lastname, email, password));


    // if (await expenses_instance.duplicate(email) !== 0) {
    // }
    // else if (await expenses_instance.duplicate(email)){
    //     let password = uid();
    //     await expenses_instance.storedNames(user, lastname, email, password)
    //     req.flash('sukuna', "Hi, here is you code to login__" + password)
    // }

    res.redirect('back')

})

app.post('/login', async function (req, res) {
    let theMail = req.body.email;
    let thePass = req.body.psw;
    // console.log(thePass);
    var username = await expenses_instance.user(theMail);
    var theName = username.firstname
    // console.log(theName);
    res.redirect(`category/${theName}`)
})

app.get('/category/:theName', async function (req, res) {
    let username = req.params.theName

    res.render('category', {
        uname: username
    })
})


app.post('/category/:theName', async function (req, res) {
    let expenses1 = req.body.expenses
    
    let cost = req.body.cost
    let date = req.body.date
    let username = req.params.theName

    if (!expenses1) {
        req.flash('error', "Please select your expense!")
    }else if(!cost){
        req.flash('error', "Please select your cost!")
    }
   

    if (cost && date && expenses1) {
    await expenses_instance.expenses_data(username, expenses1, cost, date)
    // console.log(await expenses_instance.expenses_data(username, expenses1, cost, date))
    req.flash('success', "Your expenses has been saved.")
    }


    res.render('category', {
        uname: username
    })
})

app.get('/expenses/:username', async function (req, res) {
    let username = req.params.username
    let total = await expenses_instance.total(username);
    let output = `${username} your current total expenses is R${total.sum}.`
    console.log(total.sum)

    let expenses = await expenses_instance.get_data(username);
    res.render('expenses', {
        username,
        output,
        expenses,
        helpers: {
            sukuna: date => {
                return new Date(date).toDateString()
            }
        }
    })

})



app.get('/reset', async function (req, res) {

    await expenses_instance.reset();

    res.redirect('/')

})

const PORT = process.env.PORT || 3030;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});