module.exports = function expenses(db) {

    async function storedNames(username) {
        let duplicate = await db.oneOrNone('SELECT firstname FROM users_key WHERE firstname = $1', [username]);

        if (duplicate == null) {
            await db.none('INSERT INTO users_key(firstname) values($1)', [username]);
        }

    }

    async function greet(personName) {

        var currentName = await db.one('select firstname from users_key where firstname=$1', [personName])
        //   console.log(currentName)
        return currentName
    }

    async function expenses_data(fname, expense, cost, date) {
      
        let users_id = await db.one('SELECT id from users_key WHERE firstname=$1', [fname])
        // console.log(users_id)
        let category_id = await db.one('SELECT id from category_key WHERE category=$1', [expense])
        // console.log(category_id)

        // if (cost & date != null) {
            await db.none('INSERT INTO expense(users_id, category_id, cost, dates) values($1, $2, $3, $4)', [users_id.id, category_id.id, cost, date]);
        // console.log(await db.none('INSERT INTO expense(users_id, category_id, cost, dates) values($1, $2, $3, $4)', [users_id.id, category_id.id, cost, date]))
        // }
    }

    async function get_data(user){
    const stuff = await db.manyOrNone('SELECT category_key.category, expense.cost FROM expense INNER JOIN users_key ON expense.users_id = users_key.id INNER JOIN category_key ON expense.category_id = category_key.id WHERE users_key.firstname = $1 ORDER BY expense.dates DESC',[user]);
     console.log(stuff)
    return stuff      
    }

    async function total(user){
        console.log(user)
        let thetotal = await db.one('SELECT sum(cost) from expense INNER JOIN users_key ON expense.users_id = users_key.id WHERE firstname = $1', [user])
        console.log(thetotal)
        return thetotal
    }

    async function reset() {
        await db.none('truncate table expense');
    }

    return {
        storedNames,
        greet,
        expenses_data,
        reset,
        get_data,
        total
    }

}