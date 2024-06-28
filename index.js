import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';

const app = express();
const port = 3000;

const filename = "database.db"
console.log(filename)

/**
 * Configura la instancia de Sequelize para usar SQLite.
 */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Clase que representa un libro.
 * 
 * @class
 * @extends {Model}
 */
class Book extends Model { }

/**
 * Inicializa el modelo de libro.
 */
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.STRING,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Obtiene todos los libros.
 * 
 * @name get/books
 * @function
 * @memberof module:routes/books
 * @inner
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Array<Book>} Lista de libros.
 */
app.get('/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Obtiene un libro por ID.
 * 
 * @name get/books/:id
 * @function
 * @memberof module:routes/books
 * @inner
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Book} El libro encontrado.
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Crea un nuevo libro.
 * 
 * @name post/books
 * @function
 * @memberof module:routes/books
 * @inner
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Book} El libro creado.
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Actualiza un libro por ID.
 * 
 * @name put/books/:id
 * @function
 * @memberof module:routes/books
 * @inner
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Book} El libro actualizado.
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Elimina un libro por ID.
 * 
 * @name delete/books/:id
 * @function
 * @memberof module:routes/books
 * @inner
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Object} Mensaje de confirmación.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia el servidor y escucha en el puerto especificado.
 * 
 * @function
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
