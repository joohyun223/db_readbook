const router = require("express").Router();
const Book = require("../models/book");
const axios = require('axios');


const reducePromises = (array, callback) => ( // [A]
  array.reduce((prevPrms, currElem, index) => ( // [B]
    prevPrms.then(async prevRes => {
      const currRes = await callback(currElem, index); // [C]
      return [...prevRes, currRes];
    })
  ), Promise.resolve([]))
)

// thumbnail 업데이트
router.post("/update", (req, res) => {
  Book.findAll().select('isbn')
    .then((books) => {
      if (!books.length)
        return res.status(404).send({ err: "Books not found" });

      reducePromises(books, book => {
        return axios
          .get(`${process.env.DAPI_URL}?target=isbn&query=${book.isbn}`, {
            headers: {
              Authorization: process.env.KAKAO_API_KEY,
            },
          }).then(res=>{
            if(res.data.documents.length){
              Book.updateOne({ isbn: book.isbn }, { poster: res.data.documents[0].thumbnail||'' }).then(()=>{
              })
            }
          })
      }).catch(err=>{
        console.log('err' , err);
        return res.status(404).send({err2: err})
      })

    })
    .catch((err) => res.status(500).send(err));
});

module.exports = router;
