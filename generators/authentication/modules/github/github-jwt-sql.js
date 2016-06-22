if (req.isAuthenticated()) {
  new User({ github: profile.id })
    .fetch()
    .then(function(user) {
      if (user) {
        return res.status(409).send({ msg: 'There is already an existing account linked with Github that belongs to you.' });
      }
      user = req.user;
      user.set('name', user.get('name') || profile.login);
      user.set('gender', user.get('gender') || profile.gender);
      user.set('picture', user.get('picture') || profile.avatar_url;
      user.set('location', user.get('location') || profile.location);
      user.set('github', profile.id);
      user.save(user.changed, { patch: true }).then(function() {
        res.send({ token: generateToken(user), user: user });
      });
    });
} else {
  // Step 3b. Create a new user account or return an existing one.
  new User({ github: profile.id })
    .fetch()
    .then(function(user) {
      if (user) {
        return res.send({ token: generateToken(user), user: user });
      }
      new User({ email: profile.email })
        .fetch()
        .then(function(user) {
          if (user) {
            return res.status(400).send({ msg: user.get('email') + ' is already associated with another account.' })
          }
          user = new User();
          user.set('name', profile.login);
          user.set('email', profile.email);
          user.set('gender', profile.gender);
          user.set('location', profile.location);
          user.set('picture', profile.avatar_url);
          user.set('github', profile.id);
          user.save().then(function(user) {
            res.send({ token: generateToken(user), user: user });
          });
        });
    });
}
