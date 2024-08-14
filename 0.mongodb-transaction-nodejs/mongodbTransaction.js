require('dotenv').config()
const { MongoClient } = require("mongodb")

async function main() {
    const uri = process.env.MONGODB_ATLAS_URI

    // Create `MongoDB Client` using `uri`
    const client = new MongoClient(uri)

    try {

        await client.connect()
        console.log("MongoDb Connected")

        // Create new `session object` using `MongoDB client object`
        const session = client.startSession()
        session.startTransaction()

        // Create Database instance using `MongoDB client object`
        const database = client.db(`TestingDB`)

        // Returns a reference to a MongoDB Collection. If it does not exist it will be created implicitly.
        const collection1 = database.collection("collection1")
        const collection2 = database.collection("collection2")

        try {
            // One or More Transactions
            await collection1.insertMany([
                { name: "Thaw Thaw", email: "thaw@gmail.com" },
                { name: "Thiri Ko Ko", email: "thirikoko@gmail.com" },
            ], { session })

            await collection2.insertMany([
                { name: "Ko Htet", email: "kohtet@gmail.com" },
                { name: "Ko Demo", email: "kodemo@gmail.com" },
            ], { session })

            // Transaction Commit
            await session.commitTransaction()
            console.log(`Transaction committed.`)

        } catch (error) {
            // If something fail in this transaction 
            await session.abortTransaction()
            console.error(`Transaction aborted due to an error: ${error}`)
        } finally {
            session.endSession()
        }

    } finally {
        await client.close()
    }

}

main().catch(console.error)