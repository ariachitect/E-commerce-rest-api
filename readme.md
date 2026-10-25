# MVP E-commerce REST API

## 📌 About the Project

This project is an MVP e-commerce REST API built with Node.js, Express.js, and MongoDB. Following the MVC architectural pattern, it provides product management operations, advanced data querying, and aggregation-based reporting through RESTful endpoints.

## 🛠️ Key Features

- 📦 **Product Management:** Create, read, update, and delete products.
- 🔎 **Advanced Querying:** Filtering, sorting, field selection, and pagination.
- 📊 **Aggregation & Reporting:** Product classification, inventory valuation, expiration status, and brand performance reports.

## ⚙️ Tech Stack

- **Runtime:** <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg" width="18" height="18" /> Node.js
- **Framework:** <img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg" width="18" height="18" /> Express.js
- **Database:** <img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" width="18" height="18" /> MongoDB
- **ODM:** Mongoose

## 🚀 How to Test It

I’ve deployed the project on Render and prepared a Postman collection so you can try the API without having to set up or run the project yourself.

### 1. Test It Directly in Postman <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" width="25" height="25" />

The easiest way to get started is through my [Postman collection](https://www.postman.com/ariarad-ces-team/ariachitect-public-postman-space/http-request/1hiyscm/get-all-products?sideView=agentMode).

There, you can explore all the endpoints, see examples and instructions, and test the API directly in Postman.

To try the requests, simply sign in to your free Postman account. You can also use Postman's Agent in the same environment to interact with and test the API.

### 2. Test It with Any HTTP Client or AI Agent

If you prefer not to use Postman, you can use the live API on Render with any HTTP client or AI agent that supports sending HTTP requests.

I’ve also prepared [complete API documentation 📖 ](https://documenter.getpostman.com/view/40583599/2sBYHUSf7d) with endpoint details, examples, and instructions to help you test the available features.

```url
Application URL: https://e-commerce-rest-api-508x.onrender.com
API endpoint: /api/v1/products
```

So for example you can sen this request to Get all the products list:

```http
GET https://e-commerce-rest-api-508x.onrender.com/api/v1/products/api/v1/products
```

### 3. Run the Project Locally 💻

You can also run the project locally on your own machine. Follow these steps to get started.

**1. Clone the repository and install dependencies**

```shell
git clone https://github.com/ariachitect/E-commerce-rest-api.git
cd E-commerce-rest-api
npm install
```

**2. Configure environment variables**

Create a `.env` file in the project root with the following variables:

```env
HOST=127.0.0.1
PORT=5053
DATABASE=your_mongodb_connection_string
```

`HOST` and `PORT` are optional. If omitted, the application uses `127.0.0.1` and `5053` by default. Replace `your_mongodb_connection_string` with your MongoDB connection string.

**3. Set up MongoDB**

You can use either of these options:

- **MongoDB Atlas:** Create a cluster and add its connection string to the `DATABASE` variable in your `.env` file.
- **Local MongoDB:** Install MongoDB and start the MongoDB server (`mongod`) on your machine. Then, add your local MongoDB connection string to `DATABASE`.

**4. Initialize the database**

After setting up MongoDB, run the following script to import the initial sample data from `data/sample_products.json`:

```
node autoDataImporter.js
```

Make sure your database is accessible before running the script.

**5. Start the application**

```
npm run dev
```

If everything is configured correctly, you should see the messages `we are listening on` and `DB connected successfully` in the terminal.

You can now test the API using the [Postman documentation](https://documenter.getpostman.com/view/40583599/2sBYHUSf7d).

## 📄 Project Report

For a more detailed explanation of the project's architecture, request flow, and implementation, please refer to [project_report.pdf](https://github.com/ariachitect/E-commerce-rest-api/tree/master/project_documents).

## 💬 Feedback & Contact

If you have any questions, suggestions, or feedback, or if you notice any issues with the project, I would be happy to hear from you.

Besides GitHub, you can also reach me by email at : 📫  [ariarad.ce@gmail.com](mailto:ariarad.ce@gmail.com) .
