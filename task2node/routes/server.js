// מייבא את הספרייה express
const express = require("express");

const app = express();
app.use(express.json()); // מאפשר קבלת נתונים בפורמט JSON

// מערך לאחסון המוצרים (שימוש בזיכרון בלבד - לא נשמר אחרי הפעלה מחדש)
const products = [];

// פונקציה למציאת מוצר לפי מזהה
function findProduct(id) {
  return products.find((product) => String(product.id) === String(id));
}

// דף הבית – רק לבדוק שהשרת עובד
app.get("/", (req, res) => {
  res.send("welcome to api list ");
});

// מחזיר את כל המוצרים
app.get("/api/products", (req, res) => {
  res.json(products);
});

// מחזיר מוצר לפי מזהה
app.get("/api/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product);
});

// מוסיף מוצר חדש
app.post("/api/products", (req, res) => {
  const { id, name, price, stock } = req.body;

  // בדיקות תקינות
  if (!id || !name || price === undefined) {
    return res.status(400).json({ message: "need to send id, name ו-price" });
  }
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "the price need to be positive " });
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return res
      .status(400)
      .json({ message: "the products need to be positive" });
  }

  // בדיקת מזהה ייחודי
  if (findProduct(id)) {
    return res
      .status(400)
      .json({ message: "product with id is already exist" });
  }

  // הוספת המוצר למערך
  products.push({ id, name, price, stock: stock || 0 });
  res.status(201).json({ message: "product add sucessful" });
});

// עדכון מוצר לפי מזהה
app.put("/api/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  const { name, price, stock } = req.body;

  // עדכון שדות אם נשלחו
  if (name !== undefined) product.name = name;
  if (price !== undefined) {
    if (typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ message: "the price need to be positive " });
    }
    product.price = price;
  }
  if (stock !== undefined) {
    if (typeof stock !== "number" || stock < 0) {
      return res
        .status(400)
        .json({ message: "the products need to positive or 0" });
    }
    product.stock = stock;
  }

  res.json({ message: "the product added sucessful" });
});

// מחיקת מוצר לפי מזהה
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(
    (product) => String(product.id) === String(req.params.id)
  );
  if (index === -1) {
    return res.status(404).json({ message: "product not found" });
  }

  products.splice(index, 1);
  res.json({ message: "the product remove sucessfl" });
});

// הפעלת השרת
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 the servier is running in port  http://localhost:${PORT}`);
});
