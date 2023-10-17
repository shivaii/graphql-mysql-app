const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Address {
    id: Int 
    addrNo: String 
    addrLine1: String
    addrLine2: String
    city: String
    postcode: String
    country: String
  }
  
  type Customer {
    id: Int 
    firstName: String 
    lastName: String
    gender: String
    email: String
    landLine: String
    mobile: String
    addressId: String
    address: Address
  }
  
  type Product {
    id: Int 
    title: String 
    description: String 
    unitPrice: String
    availableQty: Int
  }
  
  type CustomerOrder {
    id: Int 
    dateOrdered: String 
    orderedQty: Int 
    productId: Int 
    customerId: Int 
    product: Product
    customer: Customer
  }
  

  type Query {
    getAddress: [Address],
    getCustomers: [Customer],
    getCustomerById(id: Int!): Customer
    getProducts: [Product],
    getProductByProdId(id: Int!): Product
    getOrderById(id: Int!): CustomerOrder
  }

  type Mutation {
    createAddress(
        addrNo: String 
        addrLine1: String
        addrLine2: String
        city: String
        postcode: String
        country: String
    ): Address

    createCustomer(
        firstName: String 
        lastName: String
        gender: String
        email: String
        landLine: String
        mobile: String
        addressId: Int
    ): Customer
    
    createProduct(
        title: String 
        description: String 
        unitPrice: String
        availableQty: Int
    ): Product
    
    saveOrder(
        orderedQty: Int 
        productId: Int 
        customerId: Int 
    ): CustomerOrder
  }
`;

module.exports = typeDefs;
