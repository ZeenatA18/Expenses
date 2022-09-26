module.exports = function expenses(db) {

    async function storedNames(username, email) {
        let duplicate = await db.oneOrNone('SELECT firstname FROM users_key WHERE firstname = $1', [username]);

        if (duplicate == null) {
            await db.none('INSERT INTO users_key(firstname,email) values($1, $2)', [username, email]);
        }

    }

    async function greet(personName) {

        var currentName = await db.one('select firstname from users_key where firstname=$1', [personName])
        //   console.log(currentName)
        return currentName
    }



    return {
        storedNames,
        greet
    }

}