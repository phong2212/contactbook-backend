const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Kết nối thành công database!");

        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (err) {
        console.log("Không kết nối được database!", err);
        process.exit();
    }
}

startServer();