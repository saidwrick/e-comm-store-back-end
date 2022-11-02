# Storeify

Full Stack E-Commerce platform. Allows users to manage store inventory and display items for browsing in a customer-facing online store. 

Note: this is a demo version, so certain features (user accounts, checkout flow, etc.) haven't been implemented. 

[Live Demo](https://storeify.netlify.app/) (server might take a minute to start)

[Front-End Repo](https://github.com/saidwrick/storeify)

[Back-End Repo](https://github.com/saidwrick/storeify-back-end)

## Technologies
- JavaScript
- ReactJS
- Redux
- NodeJS
- Express
- Vanilla CSS
- MySQL
- AWS
- Cloudniary (for pictures)
- Front-End Hosted on Netlify
- Back-End Hosted on Render

## Features
### Front-End

- Online Store
  - Dynamically generated products display, updates live when inventory is changed
  - Filter & Sort products by available Categories
  - Auto-search of products on input
  - Add items to cart either from main page, or specific product page
  - Cart items are persisted (will be the same even if users leave site) and available globally
  - Auto generated Cart Total, when adding products or changing quantity
  - Call to Action prompt when products are low in stock
  - Auto-loads more products when reaching end of the page
  
- Inventory Management
  - Add, Edit, or Delete products 
  - Product details are displayed and editable in-line 
  - Hovering over cells displays the full content text
  - Update buttons are disabled when required fields are missing
  - Upload images
  - New categories can be added in either a pop-up modal or menu
  - Can only delete categories if no products are using it
  - Filter, Sort, and Search products
  
- General
  - Responsive web and mobile design
  - Graceful error handling (error messages within components when applicable, or entire 404/500 error pages)
  - Nav-bar to switch between live store and inventory (would be separate for a real implementation, but handy for a demo site)
  - Pagination of products
  
### Back-End

- REST API
  - GET/ PUT/ POST/ DELETE actions for resources (products, categories)
  - Allows user to filter GET requests on multiple options
  - Pagination using offset and limit
  - Proper Error Code Responses and Messages
  - Validates form content before writing to database

- Database
  - Read & Write to MySQL database
  - Hosted on AWS

