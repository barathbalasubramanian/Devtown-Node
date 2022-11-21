const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const initialize = (passport, getUserByEmail, getUserById) => {
  const authenticate = async (email,password, done) => {
    const user = getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "No user with that email" });

    }
    try {

      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "password Incorrect" });
      }
    } catch (e) {

      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticate));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, getUserById(id)));
};

module.exports = initialize;

