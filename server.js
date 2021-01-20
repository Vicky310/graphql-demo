var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hero(id: Int!): Person
  },
  type Person {
    id: Int
    name: String
    age: Int
    ability: String
  }
  type Mutation {
    updateHero(id: Int!, name: String!, ability: String): Person
  }
`);

var heroes = [
  {
    id: 1,
    name: 'Iron Man',
    age: '40',
    ability: 'Flying, Rockets'
  },
  {
    id: 2,
    name: 'Dr. Strange',
    age: '30',
    ability: 'Magic'
  },
  {
    id: 3,
    name: 'Hulk',
    age: '45',
    ability: 'Anger'
  },
  {
    id: 4,
    name: 'Ant man',
    age: '26',
    ability: 'Shrink'
  },
  {
    id: 5,
    name: 'Black Widow',
    age: '25',
    ability: 'Spy'
  }
];

// Return a single hero
var getHero = function (args) {
  var heroId = args.id;
  return heroes.filter(hero => hero.id == heroId)[0];
}

// Updates a hero and returns new hero details
var updateHero = function ({ id, name, ability }) {
  heroes.map(hero => {
    if (hero.id === id) {
      hero.name = name;
      hero.ability = ability;
      return hero;
    }
  });
  return heroes.filter(hero => hero.id === id)[0];
}


// Root resolver
var root = {
  hero: getHero,  // Resolver function to return hero with specific id
  updateHero: updateHero
};


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');