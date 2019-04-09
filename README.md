# Handcrafty

An Etsy-like full stack web app built with React.js, GraphQL, Node.js, etc.

## Features

Handcrafty is a full stack online handcrafts store with real credit card checkout. Users can search, sell, edit, add to cart and buy their favorite items.

- Frontend with `React.js` and `Apollo`:
  - Server side rendering and routing with `Next.js`.
  - Styling with `styled components 💅`.
  - `Apollo-client` for fetching/caching data from the GraphQL backend, and local state management.
  - Testing with `Jest` and `Enzyme`.
- Backend with `GraphQL Yoga` and `Prisma`:

  - Extensive relational data models including users, items, orders, shopping cart items, and order items, utilizing the full power of `GraphQL`.

  - Server side functionalities including JWT authentication, permissions, email password updates, uploading images, and charging credit cards with `Stripe.js`

## Deployed

- Frontend: [https://handcrafty-react.herokuapp.com/](https://handcrafty-react.herokuapp.com/)
- Backend: [https://handcrafty-gql.herokuapp.com/](https://handcrafty-gql.herokuapp.com/)
