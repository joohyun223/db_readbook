const router = require("express").Router();

//스프레드 시트에서 db업데이트시 비밀번호 체크
router.post("/checkDepPass", (req, res) => {
  if (req.body.pw == process.env.GSS_DEP_PATH) {
    res.status(200).json({ result: "ok" });
  } else {
    res.json({ result: "Invalid password" });
  }
});

router.get("/test", (req, res) => {
  res.status(200).send("Tested");
});

module.exports = router;
