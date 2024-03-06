const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const ContactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await ContactService.findByName(name);
        } else {
            documents = await ContactService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the contacts")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                'Error retrieving contact with id=${req.params.id}'
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact not found" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                'Error updating contact with id=${req.params.id}'
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const ContactService = new ContactService(MongoDB.client);
        const document = await ContactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                'Could not delete contact with id=${req.params.id}'
            )
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const ContactService = new ContactService(MongoDB.client);
        const deletedCount = await ContactService.deleteAll();
        return res.send({
            message: '${deleteCount} contacts were deleted successfully',
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

exports.findAllFavorites = async (_req, res, next) => {
    try {
        const ContactService = new ContactService(MongoDB.client);
        const documents = await ContactService.findFavorites();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

