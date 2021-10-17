const router = require("express").Router();
const Book = require("../models/book");
const Person = require("../models/person")
const axios = require('axios');
const Borrow = require("../models/borrow");

router.get("/best", (req, res) => {
  //db return
  Person.findAll().then((result)=>{
    res.status(200).send(result);
  })
});

router.post("/best", (req, res) => {
  var now = new Date();
  var lastMonth =new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //월 말 마다 db에 내용 추가
  Borrow.findAll().distinct('lender').then(async r=>{
    const borrowResult = await Promise.all(r.map(element => {
        return Borrow.find({'lender':element}).then(result=>{
          return {name: element, email: result[0].email, rendCnt: result.length, gId: result[0].gId, year: lastMonth.getFullYear(), month:lastMonth.getMonth()+1}
        });
      }
    ));

    getBalloonInfo().then((bInfo)=>{
      borrowResult.map((borrowData, i)=>{
        const person=  bInfo.data.returnData.filter(data=>{
          return data.name ==  borrowData.name && data.email == borrowData.email;
        })
        borrowResult[i].picture = (person.length)?  person[0].picture: '';
      })
    }).finally(()=>{
      const result = {};
      result.date = `${lastMonth.getFullYear()}-${lastMonth.getMonth()+1}`;     
      result.data = [];
      result.data.push(borrowResult);
      var person = new Person({...result});
      person.save((err)=>{
        if (err) {
          console.error("errorOccured", err);
          res.status(400).json({ result: 0, error: err });
          return;
        }
      });
      res.status(200).json({ result: 1 });
    })
  });
}); 

router.delete("/best", (req, res) => {
  //db return
  Person.deleteMany().then(()=>{
    res.json({ result: "delete success" });
  })
});

const getBalloonInfo = async(isbn)=> {
  return await axios.get(`https://balloon.rsupport.com/api/users-info`);
}
  
module.exports = router;