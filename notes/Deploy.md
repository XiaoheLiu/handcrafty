# Deploy on Heroku

```bash
heroku create:app handcrafty-react
git remote -v
git remote add heroku-frontend https://git.heroku.com/handcrafty-react.git
git subtree push --prefix frontend heroku-frontend master
```
