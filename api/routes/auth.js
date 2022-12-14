const router = require("express").Router(); // importation de express
const User = require("../models/User");
const bcrypt = require("bcrypt"); // Importation de bcrypt qui permet de hahs le mdp
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    const token =  jwt.sign(         // .sign permet d'encoder un nouveau token
      { userId: user._id, },
      'RANDOM_TOKEN_SECRET',  // encodage avec des caractères secrets
      { expiresIn: '24h' }
    )
    res.status(200).json({user,token})
    
  } catch (err) {
    res.status(500).json(err)
  }
});


// logout 

router.get("/logout", async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
});



module.exports = router;
