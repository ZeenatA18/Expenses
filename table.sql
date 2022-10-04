-- database name => expenses_app
-- user => postgres
-- pword => pg123

CREATE TABLE users_key(
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL
   
);

CREATE TABLE category_key(
    id SERIAL NOT NULL PRIMARY KEY,
    category VARCHAR(30) NOT NULL
);

CREATE TABLE expense(
    id SERIAL NOT NULL PRIMARY KEY,
    users_id integer not null,
    category_id integer not null,
    cost float not null,
    dates date,
    foreign key (users_id) references users_key(id),
    foreign key (category_id) references category_key(id)

);

insert into category_key (category) values('travel');
insert into category_key (category) values('food');
insert into category_key (category) values('toiletries');
insert into category_key (category) values('data');
