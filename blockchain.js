const crypto = require('crypto');
const readline = require('readline');

// Setup readline for taking input from the user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Mock Blockchain with a structure
let blockchain = [
    {
        "index": 1,
        "timestamp": "2024-09-17T10:00:00",
        "data": {
            "product": {
                "productID": "123456",
                "productName": "Smartphone",
                "description": "A high-end smartphone with 128GB storage.",
                "price": 699.99
            }
        },
        "previousHash": "0",
        "hash": "a12b0c81df8f1b4ed9e982e5ad23c6ff"
    }
];

// Function to create a new block
function createNewBlock(productDetails) {
    const previousBlock = blockchain[blockchain.length - 1];

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

// Function to take input from the user for a new product
const inputProductDetails = () => {
    rl.question("Enter Product ID: ", (productID) => {
        rl.question("Enter Product Name: ", (productName) => {
            rl.question("Enter Product Description: ", (description) => {
                rl.question("Enter Product Price: ", (price) => {
                    // Convert price to a number
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

                    rl.question("Do you want to add another product? (yes/no): ", (answer) => {
                        if (answer.toLowerCase() === "yes") {
                            inputProductDetails(); // Ask for another product
                        } else {
                            console.log("\nBlockchain after adding new blocks:", JSON.stringify(blockchain, null, 2));
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
