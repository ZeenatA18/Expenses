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
        // console.log(regNumbers)
        let users_id = await db.one('SELECT id from users_key WHERE firstname=$1', [fname])
        let category_id = await db.one('SELECT id from category_key WHERE category=$1', [expense])
        

        if (users_id & category_id ) {
            await db.none('INSERT INTO expense(users_id, category_id, cost, date) values($1, $2, $3, $4)', [fname.id, expense.id, cost, date]);
        }
    }


    return {
        storedNames,
        greet,
        expenses_data
    }

}