const bcrypt = require("bcrypt");

const storedHashedPassword = "$2b$10$TFZtsDP2wK589uZXf/4WJulZDlZlw/S/0yLmYFHp5YJyUS3dLi4xK";
const enteredPassword = "ram";

async function testBcrypt() {
    const newlyHashed = await bcrypt.hash(enteredPassword, 10);
    console.log("Newly Hashed Password:", newlyHashed);
    const match = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Match?", match);
}
testBcrypt();