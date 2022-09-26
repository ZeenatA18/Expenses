database name => 

CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(10) NOT NULL,
    user password  VARCHAR(10) NOT NULL
);

CREATE TABLE category(
    id SERIAL NOT NULL PRIMARY KEY,
    
);

CREATE TABLE expense(
    id SERIAL NOT NULL PRIMARY KEY,
    users_id integer not null,
    category_id integer not null,
    foreign key (users_id) references users(id),
     foreign key (category_id) references category(id)

);

