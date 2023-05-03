const { Pool } = require('pg');
const properties = require("./json/properties.json");
const users = require("./json/users.json");

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(`SELECT title FROM properties LIMIT 10;`)
  .then(response => { console.log(response) })



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(
      `SELECT * FROM users WHERE email = $1`, [email]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return null
    })
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(
      `SELECT * FROM users WHERE id = $1`, [id]
    )
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      return null
    })

  // return Promise.resolve(users[id]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0]
    })
    .catch((err) => {
      return null
    })

};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $2
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $1;
  `, [limit, guest_id])
    .then((result) => {
      return result.rows
    })
    .catch((err) => { return null })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  //created empty array to push the object value from options
  const queryParams = [];

  let queryString = `SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    //concatenate the query string with WHERE clause with what has been pushed into the  queryParams array
    if (queryString.includes('WHERE')) {
      queryString += ` 
     AND city LIKE $${queryParams.length} 
    `;
    } else {
      queryString += `WHERE city LIKE $${queryParams.length}`
    }

  } if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryString.includes('WHERE')) {
      queryString += `
     AND owner_id = $${queryParams.length} 
      `;
    } else {
      queryString += `WHERE owner_id = $${queryParams.length}`
    }
  } if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100)
    if (queryString.includes('WHERE')) {
      queryString += `
     AND cost_per_night >= $${queryParams.length} 
    `;
    } else {
      queryString += `WHERE cost_per_night >= $${queryParams.length}`
    }
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100)
    if (queryString.includes('WHERE')) {
      queryString += `
   AND cost_per_night <= $${queryParams.length} 
  `;
    } else {
      queryString += `WHERE cost_per_night <= $${queryParams.length}`
    }
  }
   if (options.minimum_rating) {
    queryParams.push(options.minimum_rating)
    if (queryString.includes('WHERE')) {
      queryString += `
     AND rating >= $${queryParams.length} 
    `;
    } else {
      queryString += `WHERE rating >= $${queryParams.length}`
    }
   }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool
    .query(
      `INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`,
      [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night * 100, property.street, property.city, property.province, property.post_code,
      property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
    .then(res => res.rows[0])
    .catch((err) => {
      return null
    })


};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty
}

