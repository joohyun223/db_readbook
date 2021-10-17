const router = require("express").Router();
const Borrow = require("../models/borrow");
const axios = require('axios');
const moment = require("moment-timezone");


const getBookInfo = async(isbn)=> {
  return await axios.get(`http://localhost:${process.env.PORT}/books?isbn=${isbn}`);
}
// 대여정보 가져오기
router.get("/", (req, res) => {

  if(req.query.bestbook){
    Borrow.findAll().then(async r => {
      const cntInfo =r.reduce((acc, _)=>{
        const idx = acc.findIndex((arr)=>{return arr.isbn === _.isbn});
        if(idx!=-1)
        {
          acc[idx] ={...acc[idx], cnt: acc[idx].cnt+1}; 
        }else{
            acc.push({isbn: _.isbn ,cnt: 1});
        }
        return acc.sort((prev, next)=>{return next.cnt - prev.cnt});
      }, []);

      const bookInfo = await Promise.all( cntInfo.map(element => {
        return getBookInfo(element.isbn).then((res)=>{
          return {...element, poster: res.data[0].poster, name:res.data[0].name}
        })
      }))
      
      res.status(200).send(bookInfo);
      return;
    })
    return;
  }
  // 도서당 최신 대여정보 가져오기 
  if(req.query.distinct){
    Borrow.findAll().distinct('isbn').then(async r=>{
      const result = await Promise.all(r.map(element => {
          return Borrow.find({'isbn':element}).sort({'_id': -1}).limit(1).then(_distincted=>{
            return _distincted[0];
          });
        }
      ));
      res.status(200).send(result);
    });
    return; 
  }

  if (req.query) {
    Borrow.find(req.query)
      .exec()
      .then((r) => {
        res.status(200).send(r);
      });
    return;
  }

  Borrow.findAll()
    .then((borrows) => {
      if (!borrows.length)
        return res.status(404).send({ err: "Borrow not found" });
      res.status(200).send(borrows);
    })
    .catch((err) => res.status(500).send(err));
});

// CREATE 대여정보
router.post("/book", (req, res) => {
  //대여여부 확인 후 데이터 추가
  Borrow.find({'isbn': req.body.isbn}).sort({'_id':-1}).limit(1).then(borrow=>{
    if(borrow.length && borrow[0].state =="ING"){
      res.status(400).json({ result: 0, error: "aleady lended" });
      return;
    }else{
      var borrow = new Borrow();
      borrow.isbn = req.body.isbn;
      borrow.lender = req.body.lender;
      borrow.gId = req.body.gId;
      borrow.email = req.body.email;
      borrow.startTime = moment
        .tz(Date.now(), "Asia/Seoul")
        .format("YYYY-MM-DD HH:mm:ss");
      borrow.save((err) => {
        if (err) {
          console.error("errorOccured", err);
          res.status(400).json({ result: 0, error: err, req: req.body });
          return;
        }
        res.status(200).json({ result: 1 });
      });
    }
  });
  
});

//도서반납
router.put("/return", (req, res) => {
  var pro1 = Borrow.find({
    isbn: req.body.isbn,
    gId: req.body.gId,
    state: "ING",
  })
    .exec()
    .then((r) => {
      // 기존 구글시트에서 대여중인 도서의 반납인 경우 새로운 반납데이터 생성
      if (!r.length) {
        var borrow = new Borrow({
          isbn: req.body.isbn,
          gId: req.body.gId,
          lender: req.body.lender,
          returnTime: moment
            .tz(Date.now(), "Asia/Seoul")
            .format("YYYY-MM-DD HH:mm:ss"),
          state: "DONE",
        });

        borrow.save((err) => {
          if (err) {
            res.json({ result: 0, error: err, req: req.body });
            throw new Error("cannot create new borrow data");
          }
        });
      }
    });

  // readbook에서 대여 한 경우 반납처리
  var pro2 = Borrow.update(
    { isbn: req.body.isbn, gId: req.body.gId, state: "ING" },
    {
      state: "DONE",
      returnTime: moment
        .tz(Date.now(), "Asia/Seoul")
        .format("YYYY-MM-DD HH:mm:ss"),
    }
  );
    
  Promise.all([pro1, pro2])
    .then((r) => {
      res.json({ result: "update success" });
    })
    .catch((err) => {
      res.json({ result: 0, error: err, req: req.body });
    });
});

//전체 도서 삭제
router.delete("/", (req, res) => {
  Borrow.deleteMany().then(() => {
    res.json({ result: "delete success" });
  });
});

router.get("/test", (req, res) => {
  res.status(200).send("Tested");
});

module.exports = router;
