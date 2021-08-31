const router = require("express").Router();
const Book = require("../models/book");

router.get("/", (req, res) => {
  if (req.query.isbn) {
    Book.find({ isbn: req.query.isbn })
      .exec()
      .then((r) => {
        res.status(200).send(r);
      });
    return;
  }

  Book.findAll()
    .then((books) => {
      if (!books.length)
        return res.status(404).send({ err: "Books not found" });
      res.status(200).send(books);
    })
    .catch((err) => res.status(500).send(err));
});

// 관리자에서 db 업데이트
router.post("/update", (req, res) => {
  Book.deleteMany().then(() => {
    Book.insertMany(req.body).then((r) => {
      res.json({ result: "ok" });
    });
  });
});

// 대여/반납
router.put("/update", (req, res) => {
  Book.update({ isbn: req.body.isbn }, { lender: req.body.lender }).then(
    (resp) => {
      res.json({ result: "update success" });
    }
  );
});

router.delete("/", (req, res) => {
  Book.deleteMany().then(() => {
    res.json({ result: "delete success" });
  });
});

router.get("/test", (req, res) => {
  res.status(200).send("Tested");
});

module.exports = router;
