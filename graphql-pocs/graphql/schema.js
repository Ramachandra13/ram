import { buildSchema } from "graphql";

const schema = buildSchema(`

type Product {
    id: ID
    name: String
    description: String
    price: Float
    soldout: Soldout
    stores: [Store]!
}

enum Soldout{
    SOLDOUT
    ONSALE
}

type Store {
    storeName: String
}
type Query {
    getProduct(id: ID): Product
}

input StoreInput {
    storeName: String
}

input ProductInput{
    id: ID
    name: String
    description: String
    price: Float
    soldout: Soldout
    stores: [StoreInput]!
}

type Mutation {
    createProduct(input: ProductInput): Product
}

`)

export default schema;