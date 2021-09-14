const router = require("express").Router();
const { default: axios } = require("axios");
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
// 책 정보 initialize 시 poster 정보도 받아오기
router.post("/update", (req, res) => {
  let thumbnailUpdate = false;

  Book.countDocuments({})
    .then((cnt) => {
      thumbnailUpdate = !cnt ? true : false;
    })
    .catch((err) => console.log("err", err));

  Book.deleteMany().then(() => {
    Book.insertMany(req.body).then((r) => {
      res.json({ result: "ok" });
      if (thumbnailUpdate) {
        axios.post(`http://localhost:${process.env.PORT}/posters/update`);
      }
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
