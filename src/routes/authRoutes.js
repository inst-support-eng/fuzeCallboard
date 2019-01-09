const passport = require("passport");

module.exports = app => {
  // redirect user from landing page to login
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // will take user back to app
  app.get("/auth/google/callback", passport.authenticate("google"));

  // log user out
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
