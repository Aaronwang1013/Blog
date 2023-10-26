require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');// use cookie to store all session when we longin
const session = require('express-session');
const marked = require('marked');
const MongoStore = require('connect-mongo');


const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routerHelpers'); 
const app = express();
const PORT = 5000 || process.env.PORT;

//Connect db
connectDB();

app.use(express.urlencoded({ extended: true }));//use middleware
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie:{ maxAge: new Date( Date.now() + (3600000) ) }
}));

//指定js, image and css路徑
app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
//express.js 默認模板資料夾在views底下
app.set('layout' , './layouts/main');
app.set('view engine' , 'ejs');

app.locals.isActiveRoute = isActiveRoute;
//指定route 路徑
app.use('/' , require('./server/routes/main'));
app.use('/' , require('./server/routes/admin'));

app.listen(PORT , () => {
    console.log(`listen on port ${PORT}`);
})