const db = require('../database/db');

const resolvers = {
  Query: {
    getAddress: async () => {
        const [rows] = await db.query('SELECT * FROM address');
        return rows;
    },
    getCustomers: async () => {
        const [rows] = await db.query('SELECT * FROM customers as c LEFT JOIN address a on c.addressId = a.id');

        // function call to prepare the customers data
        let customersData = prepareCustomersData(rows);
        return customersData;
    },
    getProducts: async () => {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    },
    getCustomerById: async (_, { id }) => {
        // Assuming you have a database connection
        const product = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
        // Return the product, or null if it doesn't exist
        return product[0][0] || null;
    },
    getProductByProdId: async (_, { id }) => {
        // Assuming you have a database connection
        const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        // console.log('product', product[0][0]);
        // Return the product, or null if it doesn't exist
        return product[0][0] || null;
    },
    
    getOrderById: async (_, { id }) => {
        // Assuming you have a database connection
        const customerOrder = await db.query('SELECT * FROM customer_orders as co LEFT JOIN products as p on co.productId = p.id LEFT JOIN customers as c on co.customerId = c.id LEFT JOIN address as a ON c.addressId = a.id where co.id = ?', [id]);
        // function call to prepare customer order,product, customer and address details 
        let customerOrderDetails = prepareCustomerOrderData(customerOrder[0][0]);
        // Return the product, or null if it doesn't exist
        return customerOrderDetails || null;
    },
  },
  Mutation: {
    createAddress: async (_, { addrNo, addrLine1, addrLine2, city, postcode, country }
    ) => {
      const [result] = await db.query(
        'INSERT INTO address (addrNo,addrLine1,addrLine2,city, postcode,country) VALUES (?, ?,?,?,?,?)',
        [addrNo, addrLine1,addrLine2,city,postcode,country]
      );

      return {
        id: result.insertId, addrNo, addrLine1, addrLine2, city, postcode, country
      };
    },

    createCustomer: async (_, { firstName, lastName, gender, email, landLine, mobile, addressId }
    ) => {
      const [result] = await db.query(
        'INSERT INTO customers (firstName, lastName, gender, email, landLine, mobile, addressId) VALUES (?,?,?,?,?,?,?)',
        [firstName, lastName, gender, email, landLine, mobile, addressId]
      );
      return {
        id: result.insertId, firstName, lastName, gender, email, landLine, mobile,addressId
      };
    },
    
    createProduct: async (_, { title, description, unitPrice, availableQty }
    ) => {
      const [result] = await db.query(
        'INSERT INTO products (title, description, unitPrice, availableQty) VALUES (?,?,?,?)',
        [title, description, unitPrice, availableQty]
      );
      return {
        id: result.insertId, title, description, unitPrice, availableQty
      };
    },
    
    saveOrder: async (_, { orderedQty, productId, customerId }
    ) => {
      const [result] = await db.query(
        'INSERT INTO customer_orders (orderedQty, productId, customerId) VALUES (?,?,?)',
        [orderedQty, productId, customerId]
      );
      return {
        id: result.insertId, orderedQty, productId, customerId
      };
    },
    
  }
};

function prepareCustomersData(customersData) {

    let result = [];

    customersData.forEach(row => {
        let customerObj = {};
        let addressObj = {};
        customerObj.customerId = row.id;
        customerObj.firstName = row.firstName;
        customerObj.lastName = row.lastName;
        customerObj.gender = row.gender;
        customerObj.gender = row.gender;
        customerObj.landLine = row.landLine;
        customerObj.mobile = row.mobile;

        addressObj.addrNo = row.addrNo;
        addressObj.addrLine1 = row.addrLine1;
        addressObj.addrLine2 = row.addrLine2;
        addressObj.city = row.city;
        addressObj.postcode = row.postcode;
        addressObj.country = row.country;

        customerObj.address = addressObj;

        result.push(customerObj);
    });

    return result;
}

function prepareCustomerOrderData(customerOrder) {

    let customerOrderDetails = {};

    customerOrderDetails.id = customerOrder.id
    customerOrderDetails.dateOrdered = customerOrder.dateOrdered
    customerOrderDetails.orderedQty = customerOrder.orderedQty

    customerOrderDetails.product = {
        id: customerOrder.productId,
        title: customerOrder.title,
        description: customerOrder.description,
        unitPrice: customerOrder.unitPrice,
        availableQty: customerOrder.availableQty
    }

    customerOrderDetails.customer = {
        id: customerOrder.customerId,
        firstName: customerOrder.firstName,
        lastName: customerOrder.lastName,
        gender: customerOrder.gender,
        email: customerOrder.email,
        landLine: customerOrder.landLine,
        mobile: customerOrder.mobile,

        address: {
            addrLine1: customerOrder.addrLine1,
            addrLine2: customerOrder.addrLine2,
            city: customerOrder.city,
            postcode: customerOrder.postcode,
            country: customerOrder.country
        }
    }

    return customerOrderDetails;
}

module.exports = resolvers;
