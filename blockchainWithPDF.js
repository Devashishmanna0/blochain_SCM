const crypto = require('crypto');
const readline = require('readline');
const PDFDocument = require('pdfkit'); // PDF generation library
const fs = require('fs'); // File system to save PDFs

// Setup readline for taking input from the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Blockchain array starts empty (no hardcoded block)
let blockchain = [];

// Function to create a new block
function createNewBlock(productDetails) {
    const previousBlock = blockchain[blockchain.length - 1] || { hash: '0', index: 0 };

    // Function to check if the productID already exists in the blockchain
    const isProductIDUnique = (productID) => {
        return !blockchain.some(block => block.data.product.productID === productID);
    };

    // Check if the productID already exists
    if (!isProductIDUnique(productDetails.productID)) {
        console.log(`Error: Product with ID ${productDetails.productID} already exists.`);
        return null;
    }

    // Generate a hash for the new block
    const generateMockHash = () => crypto.createHash('sha256').update(JSON.stringify(productDetails) + previousBlock.hash).digest('hex');

    // Create the new block
    const newBlock = {
        "index": previousBlock.index + 1,
        "timestamp": new Date().toISOString(),
        "data": {
            "product": productDetails
        },
        "previousHash": previousBlock.hash,
        "hash": generateMockHash()
    };

    blockchain.push(newBlock);
    return newBlock;
}

// Function to generate a PDF receipt for all products
function generateCombinedPDFReceipt(filename) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filename)); // Save the PDF to a file

    doc.fontSize(18).text("Products Receipt", { align: 'center' });
    doc.moveDown();

    // Add details for each product in the blockchain
    blockchain.forEach((block, index) => {
        const product = block.data.product;
        doc.fontSize(14).text(`Product #${index + 1}`, { underline: true });
        doc.text(`Product ID: ${product.productID}`);
        doc.text(`Product Name: ${product.productName}`);
        doc.text(`Description: ${product.description}`);
        doc.text(`Price: $${product.price.toFixed(2)}`);
        doc.text(`Timestamp: ${block.timestamp}`);
        doc.moveDown();
    });

    doc.end();
    console.log(`Receipt saved as ${filename}`);
}

// Function to take input from the user for a new product
const inputProductDetails = () => {
    rl.question("Enter Product ID: ", (productID) => {
        rl.question("Enter Product Name: ", (productName) => {
            rl.question("Enter Product Description: ", (description) => {
                rl.question("Enter Product Price: ", (price) => {
                    const productDetails = {
                        productID,
                        productName,
                        description,
                        price: parseFloat(price)
                    };

                    // Attempt to create a new block
                    const newBlock = createNewBlock(productDetails);
                    if (newBlock) {
                        console.log("New block added:", JSON.stringify(newBlock, null, 2));
                    }

                    // After adding a product, ask for next action
                    rl.question("Do you want to (1) Add another product, (2) Generate a receipt for all products? (Enter 1 or 2): ", (choice) => {
                        if (choice === "1") {
                            inputProductDetails(); // Add another product
                        } else if (choice === "2") {
                            // Generate a combined receipt for all products
                            const receiptFilename = `Combined_Products_Receipt.pdf`;
                            generateCombinedPDFReceipt(receiptFilename);
                            rl.close(); // Close the readline interface
                        } else {
                            console.log("Invalid choice.");
                            rl.close(); // Close the readline interface
                        }
                    });
                });
            });
        });
    });
};

// Start by asking for the first product details
inputProductDetails();
