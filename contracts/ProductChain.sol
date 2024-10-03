// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ProductChain {
    // Define the owner of the contract
    address public owner;

    // Product structure
    struct Product {
        string productID;
        string productName;
        string description;
        uint price;
        uint timestamp;
    }

    // Mapping to store products with productID as the key
    mapping(string => Product) public products;

    // Array to hold all productIDs (to keep track of the products)
    string[] public productIDs;

    // Modifier to restrict certain functions to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    // Event to emit when a new product is added
    event ProductAdded(string productID, string productName);

    // Constructor to set the owner of the contract
    constructor() {
        require(msg.sender != address(0), "Owner cannot be zero address");
        owner = msg.sender; // Owner is the account that deploys the contract
    }

    // Function to add a new product (restricted to owner)
    function addProduct(string memory _productID, string memory _productName, string memory _description, uint _price) public onlyOwner {
        require(bytes(_productID).length > 0, "Product ID cannot be empty");
        require(products[_productID].timestamp == 0, "Product with this ID already exists"); // Check for uniqueness

        // Create the product and store it in the products mapping
        products[_productID] = Product({
            productID: _productID,
            productName: _productName,
            description: _description,
            price: _price,
            timestamp: block.timestamp // Store the current block's timestamp
        });

        // Add the product ID to the array for tracking
        productIDs.push(_productID);

        // Emit the event
        emit ProductAdded(_productID, _productName);
    }

    // Function to get all product IDs
    function getAllProductIDs() public view returns (string[] memory) {
        return productIDs;
    }

    // Function to get product details by product ID
    function getProductDetails(string memory _productID) public view returns (string memory, string memory, string memory, uint, uint) {
        Product memory product = products[_productID];
        require(product.timestamp != 0, "Product with this ID does not exist"); // Ensure product exists
        return (product.productID, product.productName, product.description, product.price, product.timestamp);
    }

    // Function to check if a product ID exists
    function isProductIDUnique(string memory _productID) public view returns (bool) {
        return products[_productID].timestamp == 0;
    }
}
