const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatesAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatesAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        return h.response({
            status: isSuccess,
            message: 'catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        }).code(201);
    }

    return h.response({
        status: isSuccess,
        message: 'catatan tidak berhasil ditambahkan',
    }).code(500);
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    return h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan',
    }).code(404);
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatesAt = new Date().toISOString;

    const index = notes.findIndex((n) => n.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatesAt,
        };

        return h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan',
    }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((n) => n.id === id);

    if (index !== 1) {
        notes.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }).code(200);
    }

    return h.response({
        status: 'success',
        message: 'Catatan tidak ditemukan.',
    }).code(404);
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
