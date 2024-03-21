import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import router from './routes';
import logger from 'morgan';
import { AppDataSource } from './config/ormconfig';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((err: Error, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(500); // err.status
  res.render('error');
});

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(logger('dev'));

app.use(router);

AppDataSource.initialize()
  .then(async () => {
    console.log('Database initialized');
  })
  .catch((error: Error) => console.log('Database connect failed: ', error));
// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
