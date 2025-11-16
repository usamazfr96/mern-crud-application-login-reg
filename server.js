// -------------------- Core Imports --------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import soap from "soap";
import { fileURLToPath } from "url";  
import bodyParser from "body-parser";
import http from 'http'; // for http
import https from 'https'; // for https

// Load environment variables
dotenv.config();

// -------------------- App Setup -----------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));

// -------------------- Database ------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// -------------------- REST Routes ---------------------
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import echoRoutes from "./routes/consumejsonapi_post.js";
import calcRoutes from "./routes/soap.js";

app.use("/api/auth", authRoutes); // for login and reg
app.use("/api/posts", postRoutes); // For posts page
app.use("/api/jsonpostapi", echoRoutes); // For json api consumption
app.use("/api/calc", calcRoutes); // for soap service consumption

// -------------------- SOAP Service --------------------
const service = {
  CalculatorService: {
    CalculatorPort: {
      Add: function(args) {
        // Input validation
        const a = parseInt(args.a);
        const b = parseInt(args.b);
        if (isNaN(a) || isNaN(b)) {
          throw {
            Fault: {
              faultcode: 'Client',
              faultstring: 'Invalid input: a and b must be numbers'
            }
          };
        }

        return {
          result: a + b
        };
      }
    }
  }
};

// Load WSDL
const wsdlXml = fs.readFileSync('wsdl/calc.wsdl', 'utf8');

// -------------------- Start Server --------------------
const HTTP_PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPSPORT || 5443;

// -------------------- SSL Options --------------------
const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// -------------------- HTTP Server --------------------
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`);
});
soap.listen(httpServer, '/calculator', service, wsdlXml, () => {
  console.log(`SOAP service available at http://localhost:${HTTP_PORT}/calculator?wsdl`);
});

// -------------------- HTTPS Server --------------------
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on port ${HTTPS_PORT}`);
});
soap.listen(httpsServer, '/calculator', service, wsdlXml, () => {
  console.log(`SOAP service available at https://localhost:${HTTPS_PORT}/calculator?wsdl`);
});
