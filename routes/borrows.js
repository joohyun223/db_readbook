const router = require('express').Router();
const Borrow = require('../models/borrow');

router.get('/', (req, res)=>{
    // res.send('GET: /borrows');
    Borrow.findAll()
    .then((borrows)=>{
        if(!borrows.length) return res.status(404).send({err: 'Borrow not found'});
        res.status(200).send(borrows);
    })
    .catch(err => res.status(500).send(err));
})

// CREATE BOOK
router.post('/book', (req, res) => {
    //대여여부 확인 후 대여n이면 데이터 추가
    var borrow = new Borrow();
    borrow.isbn = req.body.isbn;
    borrow.lender = req.body.lender;
   
    borrow.save( (err) => {
        if(err){
            console.error(err);
            res.json({result: 0, error: err, req: req.body});
            return;
        }
   
        res.json({result: 1});
   
    });
  });

router.get("/test", (req, res) => {
    res.status(200).send("Tested");
})
  

module.exports = router;