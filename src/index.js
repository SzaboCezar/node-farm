// const fs = require("fs");
// const readFile = fs.readFileSync("input.txt", "utf-8");
// console.log(readFile);
// fs.writeFileSync(`output.txt`, `${readFile}\ncreated at ${Date.now()}\n`)

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}

const http = require("http");
const url = require("url");
const fs = require('fs');
const products = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const cards = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    // OVERVIEW
    if (pathname === "/" || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })

        const cardsHTML = dataObj.map(el => replaceTemplate(cards, el)).join('')
        const overviewOutput = overview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        res.end(overviewOutput)

        // PRODUCT
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const prod = dataObj[query.id];
        const output = replaceTemplate(products, prod)
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(output);

        // API    
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found!</h1>")
    }

})

server.listen(8000, () => {
    console.log("Server is listening on port 8000");
})