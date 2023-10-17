const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.start().then(() => {
  server.applyMiddleware({ app });
});

module.exports = app;
